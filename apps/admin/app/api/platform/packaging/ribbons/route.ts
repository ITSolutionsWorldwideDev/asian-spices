// apps/admin/app/api/platform/packaging/ribbons/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  await requirePlatformAdmin();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  const values: any[] = [];
  const where: string[] = [];

  if (q) {
    values.push(`%${q}%`);
    where.push(
      `(name ILIKE $${values.length} OR color ILIKE $${values.length})`,
    );
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT *,
      COUNT(*) OVER() AS total
    FROM packaging_ribbons
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
    `,
    values,
  );

  return NextResponse.json({
    success: true,
    data: result.rows,
    total: result.rows[0]?.total || 0,
  });
}

export async function POST(req: NextRequest) {
  await requirePlatformAdmin();

  const body = await req.json();
  const { name, color, price } = body;

  const result = await pool.query(
    `
    INSERT INTO packaging_ribbons
    (name, color, price, is_active)
    VALUES ($1,$2,$3,true)
    RETURNING *
    `,
    [name, color, price],
  );

  return NextResponse.json({
    success: true,
    data: result.rows[0],
  });
}

export async function PUT(req: NextRequest) {
  await requirePlatformAdmin();

  const body = await req.json();
  const { id, name, color, price, is_active } = body;

  const result = await pool.query(
    `
    UPDATE packaging_ribbons
    SET name=$2,
        color=$3,
        price=$4,
        is_active=$5,
        updated_at=NOW()
    WHERE id=$1
    RETURNING *
    `,
    [id, name, color, price, is_active],
  );

  return NextResponse.json({
    success: true,
    data: result.rows[0],
  });
}

export async function DELETE(req: NextRequest) {
  await requirePlatformAdmin();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing id" },
      { status: 400 },
    );
  }

  await pool.query(`DELETE FROM packaging_ribbons WHERE id=$1`, [id]);

  return NextResponse.json({ success: true });
}
