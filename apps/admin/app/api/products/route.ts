// apps/admin/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

/* ------------------ GET (List Products) ------------------ */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const offset = (page - 1) * limit;

  try {
    const [items, count] = await Promise.all([
      pool.query(
        `SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM products`)
    ]);

    return NextResponse.json({
      items: items.rows,
      totalResults: Number(count.rows[0].count),
      page,
      totalPages: Math.ceil(count.rows[0].count / limit),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch products", detail: e.message },
      { status: 500 }
    );
  }
}

/* ------------------ POST (Create Product) ------------------ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await pool.query(
      `INSERT INTO products
      (name, slug, sku, item_code, category_id, subcategory_id, brand_id,
       description, price, quantity, discount_type_id, discount_value,
       created_at, updated_at)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
      RETURNING *`,
      [
        body.name,
        body.slug,
        body.sku,
        body.item_code,
        body.category_id,
        body.subcategory_id,
        body.brand_id,
        body.description,
        body.price,
        body.quantity,
        body.discount_type_id,
        body.discount_value,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to create product", detail: e.message },
      { status: 500 }
    );
  }
}
