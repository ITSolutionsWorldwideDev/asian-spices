// /app/api/orders/[orderId]/ship/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const client = await pool.connect();

  try {
    // const { weight, length, width, height, boxes } = await req.json();
    const { orderId } = await params;

    const toNumber = (val: any) =>
      val === "" || val === undefined ? null : Number(val);

    const body = await req.json();

    const weight = toNumber(body.weight);
    const length = toNumber(body.length);
    const width = toNumber(body.width);
    const height = toNumber(body.height);
    const boxes = toNumber(body.boxes) ?? 1;

    if (weight !== null && isNaN(weight)) {
      throw new Error("Invalid weight");
    }

    await client.query("BEGIN");

    // 🔹 Get order + customer
    const { rows } = await client.query(
      `
      SELECT o.*, c.first_name, c.email
      FROM store_orders o
      JOIN store_customers c ON c.id = o.customer_id
      WHERE o.id = $1
      FOR UPDATE
      `,
      [orderId],
    );

    if (!rows.length) throw new Error("Order not found");

    const order = rows[0];

    // ============================
    // 🚚 CALL SHIPPING PROVIDER API
    // ============================

    // 🔥 MOCK API CALL (replace with real provider)
    const shippingResponse = {
      tracking_number: "TRK" + Math.floor(Math.random() * 1000000),
      label_url:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TRACK123",
      provider: "ShipFast",
    };

    // ============================
    // 💾 SAVE SHIPPING DATA
    // ============================

    await client.query(
      `
      UPDATE store_orders
      SET weight = $1,
          length = $2,
          width = $3,
          height = $4,
          boxes = $5,
          tracking_number = $6,
          shipping_label = $7,
          shipping_provider = $8,
          fulfillment_status = 'shipped',
          shipped_at = now()
      WHERE id = $9
      `,
      [
        weight,
        length,
        width,
        height,
        boxes,
        shippingResponse.tracking_number,
        shippingResponse.label_url,
        shippingResponse.provider,
        orderId,
      ],
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      tracking_number: shippingResponse.tracking_number,
      label: shippingResponse.label_url,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}
