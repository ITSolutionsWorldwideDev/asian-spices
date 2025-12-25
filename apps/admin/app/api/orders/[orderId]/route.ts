import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    const orderResult = await pool.query(
      `
      SELECT
        o.order_id,
        o.order_date,
        o.status,
        o.total_amount,
        o.shipping_address,
        o.payment_method,
        o.payment_reference,
        u.name AS customer_name,
        u.email AS customer_email
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE o.order_id = $1
      `,
      [orderId]
    );

    if (!orderResult.rows.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const itemsResult = await pool.query(
      `
      SELECT
        oi.order_item_id,
        oi.quantity,
        oi.price,
        p.product_id,
        p.name,
        p.sku,
        pi.media_id AS image
      FROM order_items oi
      LEFT JOIN products p ON p.product_id = oi.product_id
      LEFT JOIN product_images pi 
        ON pi.product_id = p.product_id AND pi.is_primary = true
      WHERE oi.order_id = $1
      `,
      [orderId]
    );

    return NextResponse.json({
      order: {
        ...orderResult.rows[0],
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error("Order detail fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch order detail" },
      { status: 500 }
    );
  }
}
