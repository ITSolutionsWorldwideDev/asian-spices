// apps/admin/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

/* ------------------ GET (List Products) ------------------ */
export async function GET(req: NextRequest) {
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

  /* const query = `
    SELECT
      p.product_id,
      p.name,
      p.sku,
      p.price,
      p.quantity,
      p.status,
      c.category,
      b.name AS brand
    FROM products p
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN brand b ON b.brand_id = p.brand_id
    ${where}
    ${orderBy}
  `; */

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
}
/* export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);` 
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const offset = (page - 1) * limit;

  try {
    const [items, count] = await Promise.all([
      pool.query(
        ` SELECT p.product_id,p.name,p.sku,p.item_code,p.country_of_origin,p.price,p.quantity,
            p.status,c.category,b.name as brand,sub.title as subcategory,pi.media_id
          FROM products as p
          left join categories as c ON c.category_id = p.category_id
          left join subcategories as sub ON sub.category_id = p.subcategory_id
          left join brand as b ON b.brand_id = p.brand_id
          left join product_images as pi ON pi.product_id = p.product_id AND is_primary = true
          ORDER BY p.created_at DESC
          LIMIT $1 OFFSET $2`,
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
} */

/* ------------------ POST (Create Product) ------------------ */
export async function POST(req: NextRequest) {
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
}
