// app/api/customers/[customerId]/route.ts

import { NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;

  /* export async function GET(
  _: Request,
  { params }: { params: { customerId: string } }
) {
  const { customerId } = params; */

  try {
    const customer = await pool.query(
      `
    SELECT
      c.*,
      COUNT(o.order_id) AS total_orders,
      COALESCE(SUM(o.total_amount), 0) AS total_spent
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.customer_id
    WHERE c.customer_id = $1
    GROUP BY c.customer_id
    `,
      [customerId]
    );

    if (!customer.rows.length) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const addresses = await pool.query(
      `SELECT * FROM customer_addresses WHERE customer_id = $1`,
      [customerId]
    );

    return NextResponse.json({
      customer: customer.rows[0],
      addresses: addresses.rows,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch customer", detail: e.message },
      { status: 500 }
    );
  }
}
