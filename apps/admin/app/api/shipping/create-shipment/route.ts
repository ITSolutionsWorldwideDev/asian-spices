// apps/admin/app/api/shipping/create-shipment/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { createShipmentForOrder } from "@/lib/shipping/shippingService";
import { getCurrentStoreAPI } from "@/lib/auth/guards";
import { getShippingProvider } from "@/lib/shipping/providerFactory";
import { validateShipmentRequest } from "@/lib/shipping/validateShipmentRequest";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const store = await getCurrentStoreAPI(req);
    const storeId = store.id;

    const { orderId, shippingMethodId, parcel } = await req.json();

    if (!orderId || !shippingMethodId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or shippingMethodId" },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    // -----------------------------
    // Get order (store-scoped)
    // -----------------------------
    const orderRes = await client.query(
      `
      SELECT 
        o.*,
        COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM store_orders o
      LEFT JOIN store_order_items oi ON oi.order_id = o.id
      WHERE o.id = $1 AND o.store_id = $2
      GROUP BY o.id
      `,
      [orderId, storeId],
    );

    const order = orderRes.rows[0];

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // -----------------------------
    // 🚚 Get shipping method + provider
    // -----------------------------
    /* const methodRes = await client.query(
      `
      SELECT 
        sm.*,
        sp.slug,
        sp.id as provider_id
      FROM shipping_methods sm
      LEFT JOIN shipping_providers sp
        ON sm.provider_id = sp.id
      WHERE sm.id = $1 AND sm.store_id = $2
      `,
      [shippingMethodId, storeId],
    ); */

    const methodRes = await client.query(
      `
      SELECT 
        sm.*,
        sp.slug,
        sp.id as provider_id
      FROM store_shipping_providers as shp
	    LEFT JOIN shipping_methods sm ON sm.provider_id = sm.provider_id
      LEFT JOIN shipping_providers sp ON sm.provider_id = sp.id
      WHERE sm.id = $1 AND shp.store_id = $2 AND sm.is_active = true
      `,
      [shippingMethodId, storeId],
    );

    const method = methodRes.rows[0];

    if (!method) {
      throw new Error("Shipping method not found");
    }

    if (!method.provider_id) {
      throw new Error("This method is not API-based");
    }

    // -----------------------------
    // Validate request (NEW)
    // -----------------------------
    validateShipmentRequest({
      order,
      method,
      parcel,
    });

    // -----------------------------
    // 🧠 Resolve provider + credentials
    // -----------------------------
    const provider = await getShippingProvider(method.slug, storeId);

    if (!provider?.createShipment) {
      throw new Error("Shipping provider not implemented");
    }

    // -----------------------------
    // 📦 Build shipment input
    // -----------------------------
    const shipmentInput = {
      orderId: order.id,
      to: {
        city: order.customer_city,
        postal_code: order.customer_postcode,
        country: order.customer_country,
      },
      from: {
        city: "Warehouse City", // TODO
      },
      parcel,
    };

    // -----------------------------
    // 🚀 Create shipment
    // -----------------------------

    const existing = await client.query(
      `SELECT id FROM shipments WHERE order_id = $1`,
      [orderId],
    );

    if (existing.rows.length > 0) {
      throw new Error("Shipment already exists for this order");
    }

    const shipmentResult = await provider.createShipment(shipmentInput);

    if (!shipmentResult?.externalId) {
      throw new Error("Shipment failed: missing externalId");
    }

    // -----------------------------
    // 🏷 Generate label (optional)
    // -----------------------------
    let label = null;
    let labelUrl: string | null = null;

    try {
      label = await provider.generateLabel(shipmentResult.externalId);
      labelUrl =
        label?.url || (label as any)?.labelUrl || (label as any)?.file || null;
    } catch (err) {
      console.warn("Label generation failed");
    }

    // -----------------------------
    // 💾 Save shipment
    // -----------------------------
    const shipmentRes = await client.query(
      `
      INSERT INTO shipments
        (order_id, store_id, provider_id, shipping_method_id,
         external_shipment_id, tracking_number, label_url, raw_response)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        order.id,
        storeId,
        method.provider_id,
        shippingMethodId,
        shipmentResult.externalId,
        shipmentResult.trackingNumber || null,
        labelUrl,
        shipmentResult.raw || null,
      ],
    );

    // -----------------------------
    // 🔄 Update order
    // -----------------------------

    if (order.fulfillment_status !== "shipped") {
      await client.query(
        `
        UPDATE store_orders
        SET 
          tracking_number = $1,
          shipping_label = $2,
          fulfillment_status = 'shipped',
          updated_at = NOW()
        WHERE id = $3
        `,
        [shipmentResult.trackingNumber || null, labelUrl, orderId],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      shipment: shipmentRes.rows[0],
    });
  } catch (err: any) {
    await client.query("ROLLBACK");

    console.error("create-shipment error:", err);

    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}

/* import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { createShipmentForOrder } from "@/lib/shipping/shippingService";

export async function POST(req: NextRequest) {
  try {
    const { orderId, providerSlug } = await req.json();

    const { rows } = await pool.query(
      `SELECT * FROM store_orders WHERE id = $1`,
      [orderId]
    );

    const order = rows[0];

    if (!order) {
      return NextResponse.json(
        { success: false },
        { status: 404 }
      );
    }

    const { shipment, label } = await createShipmentForOrder(
      order,
      providerSlug || "cheapcargo"
    );

    await pool.query(
      `
      INSERT INTO shipments (order_id, provider, tracking_number, label_url, status)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        order.id,
        providerSlug,
        shipment.tracking_number,
        label?.url || null,
        "created",
      ]
    );

    return NextResponse.json({ success: true, shipment, label });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
} */

// import { getProviderCredentials } from "@/lib/shipping/providerService";
// import {
//   createShipment,
//   generateLabel,
// } from "@/lib/shipping/providers/cheapcargo";

/* export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    // 1. Get order
    const { rows } = await pool.query(
      `
      SELECT *
      FROM store_orders
      WHERE id = $1
      `,
      [orderId]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const order = rows[0];

    // 2. Get provider credentials
    const provider = await getProviderCredentials("cheapcargo");

    // 3. Create shipment
    let shipment;
    try {
      shipment = await createShipment(order, provider.credentials);
    } catch (err) {
      console.error("Shipment creation failed:", err);

      await pool.query(
        `
        UPDATE store_orders
        SET shipping_status = 'failed'
        WHERE id = $1
        `,
        [orderId]
      );

      return NextResponse.json(
        { success: false, error: "Shipment failed" },
        { status: 500 }
      );
    }

    // 4. Generate label
    let label;
    try {
      label = await generateLabel(shipment.id, provider.credentials);
    } catch (err) {
      console.error("Label generation failed:", err);
    }

    // 5. Save shipment
    await pool.query(
      `
      INSERT INTO shipments (
        order_id,
        provider,
        tracking_number,
        label_url,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        order.id,
        "cheapcargo",
        shipment.tracking_number,
        label?.url || null,
        "created",
      ]
    );

    // 6. Update order
    await pool.query(
      `
      UPDATE store_orders
      SET shipping_status = 'shipped'
      WHERE id = $1
      `,
      [order.id]
    );

    return NextResponse.json({
      success: true,
      shipment,
      label,
    });
  } catch (err) {
    console.error("Create shipment error:", err);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
} */
