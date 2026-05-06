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

    // console.log('method ==== ',method);

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

    console.log("provider ==== ", provider);

    if (!provider?.createShipment) {
      throw new Error("Shipping provider not implemented");
    }

    // -----------------------------
    // 🧠 Resolve Store Address
    // -----------------------------

    // email

    const store_address = await client.query(
      `
      SELECT s.name,
             sa.address_line1, sa.address_line2,sa.city,sa.state, sa.postal_code, 
             sa.country, sa.latitude, sa.longitude,
             setg.store_email,setg.store_phone,setg.currency_code
      FROM stores as s
      LEFT JOIN store_addresses as sa on sa.store_id = s.id
      LEFT JOIN store_settings as setg on setg.store_id = s.id
      WHERE s.id = $1 
      limit 1
      `,
      [storeId],
    );

    const store_addressRes = store_address.rows[0];

    if (!store_addressRes) {
      throw new Error("Store Address is missing");
    }

    // -----------------------------
    // 📦 Build shipment input
    // -----------------------------
    const shipmentInput = {
      orderId: order.id,
      to: {
        email: order.customer_email,
        street: order.shipping_address_line1,
        number: order.shipping_address_line2,
        city: order.shipping_city,
        postal_code: order.shipping_postal_code,
        country: order.shipping_country,
      },
      from: {
        name: order.name,
        street: store_addressRes.address_line1,
        number: store_addressRes.address_line2,
        city: store_addressRes.city,
        postal_code: store_addressRes.postal_code,
        country: store_addressRes.country,
        email: store_addressRes.store_email,
        phone: store_addressRes.store_phone,
        currency_code: store_addressRes.currency_code,
      },
      parcel,
    };

    // console.log('shipmentInput ==== ',shipmentInput);

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

    // console.log('shipmentResult ==== ',shipmentResult);

    if (!shipmentResult?.externalId) {
      throw new Error("Shipment failed: missing externalId");
    }

    // -----------------------------
    // 🏷 Generate label (optional)
    // -----------------------------
    let labelUrl: string | null = null;

    // -----------------------------
    // 💾 Save shipment
    // -----------------------------
    const shipmentRes = await client.query(
      `
      INSERT INTO shipments
        (order_id, store_id, provider_id, shipping_method_id,
         external_shipment_id, tracking_number, label_url, tracking_url,raw_response)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
        shipmentResult.trackingUrl || null,
        shipmentResult.raw || null,
      ],
    );

    // -----------------------------
    // 🔄 Update order
    // -----------------------------

    const orderData = shipmentResult.raw?.shipment?.order?.[0];
    const details = orderData?.details;

    const shippingStatus = details?.status || "new";
    const shippingPaid = orderData?.paid || false;
    const paymentUrl = shipmentResult.raw?.shipment?.url || null;

    const isBooked =
      shipmentResult.raw?.shipment?.order?.[0]?.details?.status === "booked";

    if (isBooked) {
      await client.query(
        `
          UPDATE store_orders
          SET 
            tracking_number = $1,
            shipping_status = $2,
            shipping_paid = $3,
            payment_url = $4,
            updated_at = NOW()
          WHERE id = $5
        `,
        [
          shipmentResult.trackingNumber || null,
          shippingStatus,
          shippingPaid,
          paymentUrl,
          orderId,
        ],
      );
      /* await client.query(
        `
        UPDATE store_orders
        SET 
          tracking_number = $1,
          shipping_label = $2,
          fulfillment_status = 'shipped',
          updated_at = NOW()
        WHERE id = $3
        `,
        [
          shipmentResult.trackingNumber || null,
          null, // no label yet
          orderId,
        ],
      ); */
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

/* let label = null;
    let labelUrl: string | null = null;

    try {
      label = await provider.generateLabel(shipmentResult.externalId);
      labelUrl =
        label?.url || (label as any)?.labelUrl || (label as any)?.file || null;
    } catch (err) {
      console.warn("Label generation failed");
    }
 */

/* if (order.fulfillment_status !== "shipped") {
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
    } */
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
