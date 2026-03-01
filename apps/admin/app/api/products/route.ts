// apps/admin/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireStorePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getCurrentStoreAPI } from "@/lib/auth/guards";
import { pool } from "@acme/db";

/* ------------------ GET (List Products) ------------------ */

export async function GET(req: NextRequest) {
  await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  const store = await getCurrentStoreAPI(req);

  const result = await pool.query(
    `
    SELECT 
      p.*,
      c.name AS category,
      sc.name AS subcategory,
      b.name AS brand,
      pi.url AS primary_image,
      (
        SELECT price
        FROM store_product_prices spp
        WHERE spp.product_id = p.id
          AND spp.customer_type = 'B2C'
        ORDER BY min_quantity ASC
        LIMIT 1
      ) AS b2c_price
    FROM store_products p
    LEFT JOIN store_categories c ON c.id = p.category_id
    LEFT JOIN store_subcategories sc ON sc.id = p.subcategory_id
    LEFT JOIN store_brands b ON b.brand_id = p.brand_id
    LEFT JOIN store_product_images pi 
      ON pi.product_id = p.id AND pi.is_primary = true
    WHERE p.store_id = $1
    ORDER BY p.created_at DESC
    `,
    [store.id]
  );

  return NextResponse.json({ items: result.rows });
}
/* export async function GET(req: NextRequest) {

  await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  const store = await getCurrentStoreAPI(req);

  const { searchParams } = req.nextUrl;

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  const values: any[] = [];
  let where = "WHERE 1=1";

  if (search) {
    values.push(`%${search}%`);
    where += `
      AND (
        p.name ILIKE $${values.length}
        OR p.sku ILIKE $${values.length}
      )
    `;
  }

  if (category) {
    values.push(`%${category}%`);
    where += ` AND c.category ILIKE $${values.length}`;
  }

  if (brand) {
    values.push(`%${brand}%`);
    where += ` AND b.name ILIKE $${values.length}`;
  }

  if (status !== null && status !== "") {
    values.push(status);
    where += ` AND p.status = $${values.length}`;
  }

  let orderBy = "ORDER BY p.created_at DESC";
  if (sort === "price_asc") orderBy = "ORDER BY p.price ASC";
  if (sort === "price_desc") orderBy = "ORDER BY p.price DESC";

  const query = `
    SELECT p.product_id,p.name,p.sku,p.item_code,p.country_of_origin,p.price,p.quantity,
            p.status,c.category,b.name as brand,sub.title as subcategory,pi.media_id
          FROM products as p
          left join categories as c ON c.category_id = p.category_id
          left join subcategories as sub ON sub.category_id = p.subcategory_id
          left join brand as b ON b.brand_id = p.brand_id
          left join product_images as pi ON pi.product_id = p.product_id AND is_primary = true
    ${where}
    ${orderBy}
  `;

  const result = await pool.query(query, values);

  return NextResponse.json({ items: result.rows });
} */

/* ------------------ POST (Create Product) ------------------ */
export async function POST(req: NextRequest) {
  await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  const store = await getCurrentStoreAPI(req);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const body = await req.json();

    const product = await client.query(
      `
      INSERT INTO store_products
      (store_id, name, slug, sku, item_code,
       country_id, category_id, subcategory_id, brand_id,
       description, price, quantity, discount_type, discount_value, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
      `,
      [
        store.id,
        body.name,
        body.slug,
        body.sku,
        body.item_code,
        body.country_id,
        body.category_id,
        body.subcategory_id,
        body.brand_id,
        body.description,
        body.price,
        body.quantity,
        body.discount_type,
        body.discount_value,
        body.status ?? 1,
      ]
    );

    const productId = product.rows[0].id;

    /* ---------------- B2C Price ---------------- */
    await client.query(
      `
      INSERT INTO store_product_prices
      (product_id, customer_type, min_quantity, price)
      VALUES ($1,'B2C',1,$2)
      `,
      [productId, body.price]
    );

    /* ---------------- B2B Tier Prices ---------------- */
    if (body.b2b_prices?.length) {
      for (const tier of body.b2b_prices) {
        await client.query(
          `
          INSERT INTO store_product_prices
          (product_id, customer_type, min_quantity, price)
          VALUES ($1,'B2B',$2,$3)
          `,
          [productId, tier.min_quantity, tier.price]
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json(product.rows[0], { status: 201 });
  } catch (e: any) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { error: "Failed to create product", detail: e.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
/* export async function POST(req: NextRequest) {

  await requireStorePermission(PERMISSIONS.MANAGE_PRODUCTS);
  try {
    const body = await req.json();

    const result = await pool.query(
      `INSERT INTO products
      (name, slug, sku, item_code, category_id, subcategory_id, brand_id,
       country_of_origin, description, price, quantity, discount_type_id, discount_value,
       created_at, updated_at)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
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
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to create product", detail: e.message },
      { status: 500 }
    );
  }
} */
