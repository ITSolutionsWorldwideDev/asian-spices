// apps/admin/app/api/products/import/preview/route.ts
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

  const client = await pool.connect();

  try {
    /* ---------------- FETCH EXISTING SKUS ---------------- */
    const existingSkus = await client.query(
      `SELECT sku FROM store_products`
    );

    const skuSet = new Set(existingSkus.rows.map(r => r.sku));

    const result = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const errors: string[] = [];

      /* ---------------- VALIDATION ---------------- */

      if (!row.Name) errors.push("Name is required");
      if (!row.SKU) errors.push("SKU is required");
      if (!row.Price) errors.push("Price is required");

      /* ---------------- DUPLICATE SKU CHECK ---------------- */

      if (skuSet.has(row.SKU)) {
        errors.push("Duplicate SKU already exists");
      }

      /* ---------------- JSON VALIDATION ---------------- */

      try {
        if (row["B2B Prices"]) {
          JSON.parse(row["B2B Prices"]);
        }
      } catch {
        errors.push("Invalid B2B JSON");
      }

      /* ---------------- ROW RESULT ---------------- */

      result.push({
        row: i + 2,
        data: row,
        isValid: errors.length === 0,
        errors,
      });
    }

    return NextResponse.json({
      total: rows.length,
      valid: result.filter(r => r.isValid).length,
      invalid: result.filter(r => !r.isValid).length,
      rows: result,
    });

  } finally {
    client.release();
  }
}