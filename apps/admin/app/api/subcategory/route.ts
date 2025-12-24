// /app/api/subcategory/route.ts (GET)

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

/* ------------------------------------
   Utils
------------------------------------ */
const generateCategoryCode = async (category_id: number) => {
  // Get parent category slug
  const catRes = await pool.query(
    `SELECT categoryslug FROM categories WHERE category_id = $1`,
    [category_id]
  );

  if (!catRes.rows.length) {
    throw new Error("Invalid category");
  }

  const alias = catRes.rows[0].categoryslug
    .substring(0, 2)
    .toUpperCase();

  // Count existing subcategories
  const countRes = await pool.query(
    `SELECT COUNT(*)::int AS count FROM subcategories WHERE category_id = $1`,
    [category_id]
  );

  const nextNumber = String(countRes.rows[0].count + 1).padStart(2, "0");

  return `${alias}${nextNumber}`;
};

/* ------------------------------------
   GET
------------------------------------ */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const res = await pool.query(
        `SELECT * FROM subcategories WHERE subcategory_id = $1`,
        [id]
      );

      if (!res.rows.length) {
        return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
      }

      return NextResponse.json(res.rows[0]);
    }

    const res = await pool.query(`
      SELECT s.*, c.category
      FROM subcategories s
      JOIN categories c ON c.category_id = s.category_id
      ORDER BY s.created_at DESC
    `);

    return NextResponse.json({ items: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

/* ------------------------------------
   POST
------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const { category_id, title, description, status = 1 } = await req.json();

    if (!category_id || !title) {
      return NextResponse.json(
        { error: "Category and title are required" },
        { status: 400 }
      );
    }

    const category_code = await generateCategoryCode(category_id);

    const res = await pool.query(
      `
      INSERT INTO subcategories
      (category_id, category_code, title, description, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
      `,
      [category_id, category_code, title, description || null, status]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}

/* ------------------------------------
   PUT
------------------------------------ */
export async function PUT(req: NextRequest) {
  try {
    const { subcategory_id, title, description, status } = await req.json();

    if (!subcategory_id) {
      return NextResponse.json(
        { error: "Subcategory ID required" },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `
      UPDATE subcategories
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE subcategory_id = $4
      RETURNING *
      `,
      [title, description, status, subcategory_id]
    );

    if (!res.rows.length) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 });
  }
}

/* ------------------------------------
   DELETE
------------------------------------ */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Subcategory ID required" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `DELETE FROM subcategories WHERE subcategory_id = $1 RETURNING *`,
      [id]
    );

    if (!res.rows.length) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 });
  }
}
