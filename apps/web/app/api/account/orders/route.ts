// apps/web/app/api/account/orders/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";
import { pool } from "@acme/db";

export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    let query = `
      SELECT o.*,

        json_agg(
          json_build_object(
            'id', oi.product_id,
            'title', p.name,
            'price', oi.price,
            'quantity', oi.quantity,
            'image', md.file_url
          )
        ) AS cart_items
      FROM store_orders o
      LEFT JOIN store_order_items oi ON oi.order_id = o.id
      LEFT JOIN store_products p ON oi.product_id = p.id
      LEFT JOIN store_product_images pi 
        ON pi.product_id = p.id AND pi.is_primary = true
      LEFT JOIN media md ON md.media_id = pi.url::int
      LEFT JOIN store_customers c ON c.id = o.customer_id
      WHERE c.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `;

    // console.log("query === ", query);
    // console.log("session.user.id === ", session.user.id);
    const { rows } = await client.query(query, [session.user.id]); // WHERE c.user_id = $1

    return NextResponse.json({ orders: rows });
  } finally {
    client.release();
  }
}
