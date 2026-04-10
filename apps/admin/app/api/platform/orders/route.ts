// apps/admin/app/api/platform/orders/route.ts

import { NextResponse, NextRequest } from "next/server";
import { pool } from "@acme/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const offset = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "priority";

  let where = `WHERE 1=1`;
  const values: any[] = [];

  // 🔍 Search
  if (search) {
    values.push(`%${search}%`);
    where += ` AND o.order_number ILIKE $${values.length}`;
  }

  // 📌 Status filter
  if (status) {
    values.push(status);
    where += ` AND o.order_status = $${values.length}`;
  }

  // 🔥 SORT LOGIC (Rejected first)
  let orderBy = `
    ORDER BY 
      CASE WHEN o.order_status = 'rejected' THEN 0 ELSE 1 END,
      o.rejection_count DESC,
      o.created_at DESC
  `;

  if (sort === "newest") {
    orderBy = `ORDER BY o.created_at DESC`;
  }

  const dataQuery = `
    SELECT 
      o.id,
      o.order_number,
      o.order_status,
      o.fulfillment_status,
      o.rejection_count,
      o.created_at,
      s.name as store_name
    FROM store_orders o
    LEFT JOIN stores s ON s.id = o.current_store_id
    ${where}
    ${orderBy}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM store_orders o ${where}
  `;

  const { rows } = await pool.query(dataQuery, [...values, limit, offset]);

  const { rows: countRows } = await pool.query(countQuery, values);

  return NextResponse.json({
    orders: rows,
    total: Number(countRows[0].count),
    page,
    limit,
  });
}

/* export async function GET() {
  const { rows } = await pool.query(`
    SELECT 
      o.id,
      o.order_number,
      o.order_status,
      o.fulfillment_status,
      o.rejection_count,
      o.created_at,
      s.name as store_name
    FROM store_orders o
    LEFT JOIN stores s ON s.id = o.current_store_id
    ORDER BY o.created_at DESC
    LIMIT 50
  `);

  return NextResponse.json({ orders: rows });
} */
