// apps/admin/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

interface Params {
  params: { id: string };
}

/* ------------------ GET (Single Product) ------------------ */
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const product = await pool.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [params.id]
    );

    if (!product.rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const images = await pool.query(
      `SELECT media_id FROM product_images WHERE product_id = $1`,
      [params.id]
    );

    return NextResponse.json({
      ...product.rows[0],
      images: images.rows,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch product", detail: e.message },
      { status: 500 }
    );
  }
}

/* ------------------ PUT (Update Product) ------------------ */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();

    const result = await pool.query(
      `UPDATE products SET
        name=$1,
        slug=$2,
        sku=$3,
        item_code=$4,
        category_id=$5,
        subcategory_id=$6,
        brand_id=$7,
        description=$8,
        price=$9,
        quantity=$10,
        discount_type_id=$11,
        discount_value=$12,
        updated_at=NOW()
       WHERE product_id=$13
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
        params.id,
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to update product", detail: e.message },
      { status: 500 }
    );
  }
}
