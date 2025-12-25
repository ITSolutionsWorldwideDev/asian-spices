// app/api/customers/[customerId]/orders/route.ts

import { NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;

  try {
    const orders = await pool.query(
      `SELECT order_id, order_date, status, total_amount, payment_reference
       FROM orders
       WHERE customer_id = $1
       ORDER BY order_date DESC`,
      [customerId]
    );

    return NextResponse.json({ items: orders.rows });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch orders", detail: e.message },
      { status: 500 }
    );
  }
}

/* export const GET: (request: NextRequest, context: { params: { customerId: string } }) => Promise<NextResponse> = 
  async (request, context) => {
    const { customerId } = context.params;

    const orders = await pool.query(
      `SELECT order_id, order_date, status, total_amount, payment_reference
       FROM orders WHERE customer_id = $1 ORDER BY order_date DESC`,
      [customerId]
    );

    return NextResponse.json({ items: orders.rows });
}; */


/* export async function GET(
  req: NextRequest,
  context: { params: { customerId: string } }
) {
  const { customerId } = context.params;

  const orders = await pool.query(
    `
    SELECT
      order_id,
      order_date,
      status,
      total_amount,
      payment_reference
    FROM orders
    WHERE customer_id = $1
    ORDER BY order_date DESC
    `,
    [customerId]
  );

  return NextResponse.json({ items: orders.rows });
} */