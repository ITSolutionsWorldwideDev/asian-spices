// apps/admin/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

interface Params {
  params: { id: string };
}

/* ------------------ GET (Single Product) ------------------ */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  try {
    const product = await pool.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [id]
    );

    if (!product.rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const images = await pool.query(
      `SELECT media_id FROM product_images WHERE product_id = $1`,
      [id]
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
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        country_of_origin=$8,
        description=$9,
        price=$10,
        quantity=$11,
        discount_type_id=$12,
        discount_value=$13,
        updated_at=NOW()
       WHERE product_id=$14
       RETURNING *`,
      [
        body.name,
        body.slug,
        body.sku,
        body.item_code,
        body.category_id,
        body.subcategory_id,
        body.brand_id,
        body.country_of_origin,
        body.description,
        body.price,
        body.quantity,
        body.discount_type_id,
        body.discount_value,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to update product", detail: e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await pool.query("DELETE FROM products WHERE product_id=$1", [id]);

  return NextResponse.json({ success: true });
}

