// apps/web/app/api/get-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "Missing orderId" },
      { status: 400 },
    );
  }

  try {
    const res = await pool.query(
      `
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.payment_method,
        o.transaction_id,
        o.shipping_method,
        o.customer_email,

        json_agg(
          json_build_object(
            'id', i.product_id,
            'title', p.title,
            'price', i.price,
            'quantity', i.quantity,
            'image', p.image
          )
        ) AS cart_items

      FROM store_orders o
      JOIN store_order_items i ON o.id = i.order_id
      JOIN products p ON i.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
      `,
      [orderId]
    );

    if (!res.rows.length) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
