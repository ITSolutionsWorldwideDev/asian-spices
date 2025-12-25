// apps/admin/app/api/products/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { pool } from "@acme/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  if (!rows.length) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }

  const client = await pool.connect();
  let inserted = 0;
  const errors: any[] = [];

  try {
    await client.query("BEGIN");

    for (const [index, row] of rows.entries()) {
      try {
        // ---------- Validation ----------
        if (!row.name || !row.slug || !row.sku || !row.price || !row.quantity) {
          throw new Error("Missing required fields");
        }

        // ---------- Resolve foreign keys ----------
        const categoryId = await resolveId(
          client,
          "categories",
          "category",
          row.category
        );
        const brandId = await resolveId(
          client,
          "brand",
          "name",
          row.brand
        );
        const subCategoryId = await resolveId(
          client,
          "subcategories",
          "title",
          row.subcategory
        );

        await client.query(
          `INSERT INTO products
           (name, slug, sku, item_code, category_id, subcategory_id, brand_id,
            country_of_origin, description, price, quantity,
            discount_type_id, discount_value, status, created_at, updated_at)
           VALUES
           ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())`,
          [
            row.name,
            row.slug,
            row.sku,
            row.item_code || null,
            categoryId,
            subCategoryId,
            brandId,
            row.country_of_origin || null,
            row.description || null,
            row.price,
            row.quantity,
            row.discount_type_id || null,
            row.discount_value || null,
            row.status ?? 1,
          ]
        );

        inserted++;
      } catch (e: any) {
        errors.push({ row: index + 2, error: e.message });
      }
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  return NextResponse.json({
    success: true,
    inserted,
    failed: errors.length,
    errors,
  });
}

// ---------- Helper ----------
async function resolveId(
  client: any,
  table: string,
  column: string,
  value?: string
) {
  if (!value) return null;

  const res = await client.query(
    `SELECT ${table.slice(0, -1)}_id FROM ${table} WHERE ${column} ILIKE $1`,
    [value]
  );

  if (!res.rows.length) {
    throw new Error(`${table} not found: ${value}`);
  }

  return res.rows[0][`${table.slice(0, -1)}_id`];
}
