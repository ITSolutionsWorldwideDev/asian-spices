// apps/admin/app/api/store/catalog/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  const store = await getCurrentStoreAPI(req);
  const store_id = store.id;

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const status = searchParams.get("status");

  let where = `WHERE 1=1`;
  const values: any[] = [];

  if (search) {
    values.push(`%${search}%`);
    where += ` AND (p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length})`;
  }

  if (category) {
    values.push(category);
    where += ` AND p.category_id = $${values.length}`;
  }

  if (brand) {
    values.push(brand);
    where += ` AND p.brand_id = $${values.length}`;
  }

  const result = await pool.query(
    `
    SELECT 
      p.id AS product_id,
      p.name,
      p.sku,
      c.name AS category,
      b.name AS brand,

      p.price AS base_price,
      spc.price as store_price,

      COALESCE(spc.price, p.price) AS effective_price, 

      spc.quantity,
      spc.status,

      CASE 
        WHEN spc.id IS NOT NULL THEN true 
        ELSE false 
      END AS is_overridden,
      CASE WHEN spc.id IS NOT NULL THEN true ELSE false END AS assigned,
      CASE WHEN spc.id IS NOT NULL THEN true ELSE false END AS is_assigned

    FROM store_products p
    LEFT JOIN store_product_catalog spc
      ON spc.product_id = p.id AND spc.store_id = $${values.length + 1}
    LEFT JOIN store_categories c ON c.id = p.category_id
    LEFT JOIN store_brands b ON b.brand_id = p.brand_id

    ${where}

    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
    `,
    [...values, store_id],
  );

  const count = await pool.query(
    `SELECT COUNT(*) FROM store_products p ${where}`,
    values,
  );

  return NextResponse.json({
    items: result.rows,
    total: Number(count.rows[0].count),
  });
}
//  