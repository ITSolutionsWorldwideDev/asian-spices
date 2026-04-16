// apps/admin/app/api/shipping/create-shipment/route.ts

import { NextRequest, NextResponse } from "next/server";
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
}

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