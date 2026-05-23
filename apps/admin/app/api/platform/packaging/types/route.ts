// apps/admin/app/api/platform/packaging/types/route.ts

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
      `(name ILIKE $${values.length} OR code ILIKE $${values.length})`,
    );
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT *,
      COUNT(*) OVER() AS total
    FROM packaging_types
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
  const { name, code, length_cm, width_cm, height_cm, max_weight_kg } = body;

  const result = await pool.query(
    `
    INSERT INTO packaging_types
    (name, code, length_cm, width_cm, height_cm, max_weight_kg, is_active)
    VALUES ($1,$2,$3,$4,$5,$6,true)
    RETURNING *
    `,
    [name, code, length_cm, width_cm, height_cm, max_weight_kg],
  );

  return NextResponse.json({
    success: true,
    data: result.rows[0],
  });
}

export async function PUT(req: NextRequest) {
  await requirePlatformAdmin();

  const body = await req.json();
  const {
    id,
    name,
    code,
    length_cm,
    width_cm,
    height_cm,
    max_weight_kg,
    is_active,
  } = body;

  const result = await pool.query(
    `
    UPDATE packaging_types
    SET name=$2,
        code=$3,
        length_cm=$4,
        width_cm=$5,
        height_cm=$6,
        max_weight_kg=$7,
        is_active=$8,
        updated_at=NOW()
    WHERE id=$1
    RETURNING *
    `,
    [id, name, code, length_cm, width_cm, height_cm, max_weight_kg, is_active],
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

  await pool.query(`DELETE FROM packaging_types WHERE id=$1`, [id]);

  return NextResponse.json({ success: true });
}
