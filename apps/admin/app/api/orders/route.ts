// /app/api/orders/route.ts (GET)
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search");
  const customer = searchParams.get("customer");
  const product = searchParams.get("product");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  const values: any[] = [];
  let where = "WHERE 1=1";

  if (search) {
    values.push(`%${search}%`);
    where += ` AND (
      CAST(o.order_id AS TEXT) ILIKE $${values.length}
      OR o.payment_reference ILIKE $${values.length}
      OR u.name ILIKE $${values.length}
    )`;
  }

  if (customer) {
    values.push(`%${customer}%`);
    where += ` AND u.name ILIKE $${values.length}`;
  }

  if (product) {
    values.push(`%${product}%`);
    where += ` AND p.name ILIKE $${values.length}`;
  }

  if (status) {
    values.push(status);
    where += ` AND o.status = $${values.length}`;
  }

  let orderBy = "ORDER BY o.order_date DESC";
  if (sort === "date_asc") orderBy = "ORDER BY o.order_date ASC";
  if (sort === "total_desc") orderBy = "ORDER BY o.total_amount DESC";
  if (sort === "total_asc") orderBy = "ORDER BY o.total_amount ASC";

  const query = `
    SELECT
      o.order_id,
      o.payment_reference,
      o.order_date,
      o.status,
      o.total_amount,
      u.name AS customer_name,
      COUNT(DISTINCT oi.order_item_id) AS items_count
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.order_id
    LEFT JOIN products p ON p.product_id = oi.product_id
    ${where}
    GROUP BY o.order_id, u.name
    ${orderBy}
  `;

  const result = await pool.query(query, values);

  return NextResponse.json({ items: result.rows });
}
