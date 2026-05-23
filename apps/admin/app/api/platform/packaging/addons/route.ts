// apps/admin/app/api/platform/packaging/addons/route.ts

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
    where.push(`(name ILIKE $${values.length})`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT *,
      COUNT(*) OVER() AS total
    FROM packaging_addons
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
    `,
    values
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
  const { name, price, type } = body;

  const result = await pool.query(
    `
    INSERT INTO packaging_addons
    (name, price, type, is_active)
    VALUES ($1,$2,$3,true)
    RETURNING *
    `,
    [name, price, type]
  );

  return NextResponse.json({
    success: true,
    data: result.rows[0],
  });
}

export async function PUT(req: NextRequest) {
  await requirePlatformAdmin();

  const body = await req.json();
  const { id, name, price, type, is_active } = body;

  const result = await pool.query(
    `
    UPDATE packaging_addons
    SET name=$2,
        price=$3,
        type=$4,
        is_active=$5,
        updated_at=NOW()
    WHERE id=$1
    RETURNING *
    `,
    [id, name, price, type, is_active]
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
      { status: 400 }
    );
  }

  await pool.query(`DELETE FROM packaging_addons WHERE id=$1`, [id]);

  return NextResponse.json({ success: true });
}