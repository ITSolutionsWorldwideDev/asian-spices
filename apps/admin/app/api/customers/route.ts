// apps/admin/app/api/customers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  const values: any[] = [];
  let where = "WHERE 1=1";

  if (search) {
    values.push(`%${search}%`);
    where += `
      AND (
        c.first_name ILIKE $${values.length}
        OR c.last_name ILIKE $${values.length}
        OR c.email ILIKE $${values.length}
        OR c.phone ILIKE $${values.length}
      )
    `;
  }

  if (status) {
    values.push(status);
    where += ` AND c.status = $${values.length}`;
  }

  let orderBy = "ORDER BY c.created_at DESC";
  if (sort === "date_asc") orderBy = "ORDER BY c.created_at ASC";

  const query = `
    SELECT
      c.customer_id,
      c.first_name,
      c.last_name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      COUNT(o.order_id) AS total_orders,
      COALESCE(SUM(o.total_amount), 0) AS total_spent
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.customer_id
    ${where}
    GROUP BY c.customer_id
    ${orderBy}
  `;

  const result = await pool.query(query, values);

  return NextResponse.json({
    items: result.rows,
  });
}
