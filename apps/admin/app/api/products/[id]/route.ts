// apps/admin/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentStoreAPI, requireStorePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { pool } from "@acme/db";

/* ------------------ GET (Single Product) ------------------ */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  const store = await getCurrentStoreAPI(req);

  const { id } = await params;

  const product = await pool.query(
    `
    SELECT * FROM store_products
    WHERE id = $1 AND store_id = $2
    `,
    [id, store.id],
  );

  if (!product.rows.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prices = await pool.query(
    `SELECT * FROM store_product_prices WHERE product_id=$1`,
    [id],
  );

  const images = await pool.query(
    `SELECT * FROM store_product_images WHERE product_id=$1`,
    [id],
  );

  return NextResponse.json({
    ...product.rows[0],
    prices: prices.rows,
    images: images.rows,
  });
}
/* export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  // await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
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
} */

/* ------------------ PUT (Update Product) ------------------ */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  const store = await getCurrentStoreAPI(req);

  const client = await pool.connect();
  const { id } = await params;

  try {
    await client.query("BEGIN");

    const body = await req.json();

    const product = await client.query(
      `
      UPDATE store_products SET
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
        discount_type=$11,
        discount_value=$12,
        status=$13,
        country_id=$14,
        updated_at=NOW()
      WHERE id=$15 AND store_id=$16
      RETURNING *
      `,
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
        body.discount_type,
        body.discount_value,
        body.status,
        body.country_id,
        id,
        store.id,
      ],
    );

    /* Remove old prices */
    await client.query(`DELETE FROM store_product_prices WHERE product_id=$1`, [
      id,
    ]);

    /* Reinsert B2C */
    await client.query(
      `
      INSERT INTO store_product_prices
      (product_id, customer_type, min_quantity, price)
      VALUES ($1,'B2C',1,$2)
      `,
      [id, body.price],
    );

    /* Reinsert B2B */
    if (body.b2b_prices?.length) {
      for (const tier of body.b2b_prices) {
        await client.query(
          `
          INSERT INTO store_product_prices
          (product_id, customer_type, min_quantity, price)
          VALUES ($1,'B2B',$2,$3)
          `,
          [id, tier.min_quantity, tier.price],
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json(product.rows[0], { status: 201 });

    // return NextResponse.json(product.rows[0],{ success: true });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
/* export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
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
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to update product", detail: e.message },
      { status: 500 }
    );
  }
} */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  const { id } = await params;

  await pool.query("DELETE FROM products WHERE id=$1", [id]);

  return NextResponse.json({ success: true });
}
