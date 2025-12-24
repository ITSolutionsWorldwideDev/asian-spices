// /app/api/brand/route.ts (GET)

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";


/* ------------------------------------
   GET
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
    /* -------- Single brand -------- */
    if (id) {
      const result = await pool.query(
        `SELECT * FROM brand WHERE brand_id = $1`,
        [id]
      );

      if (!result.rows.length) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    /* -------- List categories -------- */
    const where: string[] = [];
    const values: any[] = [];

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      where.push(`LOWER(name) LIKE $${values.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    let orderBy = "created_at DESC";
    if (sort === "nameAsc") orderBy = "name ASC";
    if (sort === "nameDesc") orderBy = "name DESC";
    if (sort === "dateAsc") orderBy = "created_at ASC";

    values.push(limit, offset);

    const dataQuery = `
      SELECT brand_id, name, status, created_at, updated_at
      FROM brand
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS count
      FROM brand
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
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}


/* ------------------------------------
   POST (create brand)
------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, status = 1 } = body;

    if (!brand) {
      return NextResponse.json({ error: "Brand is required" }, { status: 400 });
    }

    const result = await pool.query(
      `
      INSERT INTO brand (name, status, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
      `,
      [brand, status]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error(err);

    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Brand already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

/* ------------------------------------
   PUT (update brand)
------------------------------------ */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand_id, brand, status } = body;

    if (!brand_id) {
      return NextResponse.json({ error: "Brand ID required" }, { status: 400 });
    }

    const result = await pool.query(
      `
      UPDATE brand
      SET
        name = COALESCE($1, brand),
        status = COALESCE($2, status),
        updated_at = NOW()
      WHERE brand_id = $3
      RETURNING *
      `,
      [brand, status, brand_id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error(err);

    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Brand name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

/* ------------------------------------
   DELETE (remove brand)
------------------------------------ */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Brand ID required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `DELETE FROM brand WHERE brand_id = $1 RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
