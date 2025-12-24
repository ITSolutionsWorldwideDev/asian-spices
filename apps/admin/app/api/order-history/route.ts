// /app/api/order-history/route.ts (GET)

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const result = await pool.query(
    `SELECT
        o.order_id,
        o.payment_reference,
        o.order_date,
        o.status,
        o.total_amount,
        json_agg(
            json_build_object(
            'order_item_id', oi.order_item_id,
            'item_id', oi.itemid,
            'matchcode', i.matchcode,
            'image', i.image_url,
            'title', i.displayname,
            'quantity', oi.quantity,
            'price', oi.price
            )
        ) AS items
        FROM orders AS o
        LEFT JOIN order_items AS oi ON oi.order_id = o.order_id
        LEFT JOIN products AS i ON i.itemid = oi.itemid
        WHERE o.user_id = $1
        GROUP BY o.order_id
        ORDER BY o.order_date DESC
        `,
    [userId]
  );

  const data: any = {};
  data.orders = result.rows;
  return NextResponse.json(data);
}
