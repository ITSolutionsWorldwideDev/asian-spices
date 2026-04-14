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
    const { rows } = await client.query(
      `
      SELECT o.*
      FROM store_orders o
      JOIN store_customers c ON c.id = o.customer_id
      WHERE c.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [session.user.id],
    );

    return NextResponse.json({ orders: rows });
  } finally {
    client.release();
  }
}