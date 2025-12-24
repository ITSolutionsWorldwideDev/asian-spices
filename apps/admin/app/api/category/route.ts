// /app/api/category/route.ts (GET)

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

/* ------------------------------------
   Utils
------------------------------------ */
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ------------------------------------
   GET (list or single category)
------------------------------------ */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  const offset = (page - 1) * limit;

  try {
    /* -------- Single category -------- */
    if (id) {
      const result = await pool.query(
        `SELECT * FROM categories WHERE category_id = $1`,
        [id]
      );

      if (!result.rows.length) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    /* -------- List categories -------- */
    const where: string[] = [];
    const values: any[] = [];

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      where.push(`LOWER(category) LIKE $${values.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    let orderBy = "created_at DESC";
    if (sort === "nameAsc") orderBy = "category ASC";
    if (sort === "nameDesc") orderBy = "category DESC";
    if (sort === "dateAsc") orderBy = "created_at ASC";

    values.push(limit, offset);

    const dataQuery = `
      SELECT category_id, category, categoryslug, status, created_at, updated_at
      FROM categories
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS count
      FROM categories
      ${whereClause}
    `;

    const [dataRes, countRes] = await Promise.all([
      pool.query(dataQuery, values),
      pool.query(countQuery, values.slice(0, where.length ? 1 : 0)),
    ]);

    return NextResponse.json({
      items: dataRes.rows,
      totalResults: countRes.rows[0].count,
      page,
      pageSize: limit,
      totalPages: Math.ceil(countRes.rows[0].count / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

/* ------------------------------------
   POST (create category)
------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, status = 1 } = body;

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const slug = slugify(category);

    const result = await pool.query(
      `
      INSERT INTO categories (category, categoryslug, status, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
      `,
      [category, slug, status]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error(err);

    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

/* ------------------------------------
   PUT (update category)
------------------------------------ */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_id, category, status } = body;

    if (!category_id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    const slug = category ? slugify(category) : undefined;

    const result = await pool.query(
      `
      UPDATE categories
      SET
        category = COALESCE($1, category),
        categoryslug = COALESCE($2, categoryslug),
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE category_id = $4
      RETURNING *
      `,
      [category, slug, status, category_id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);

    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Category slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

/* ------------------------------------
   DELETE (remove category)
------------------------------------ */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Category ID required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `DELETE FROM categories WHERE category_id = $1 RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
