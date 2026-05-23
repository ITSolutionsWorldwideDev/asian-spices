// apps/admin/app/api/store/packaging/rules/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      packaging_type_id,
      min_weight_kg,
      max_weight_kg,
      min_order_amount,
      max_order_amount,
      priority,
      store_id,
    } = body;

    if (!store_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Tenant isolated branch target scope missing.",
        },
        { status: 400 },
      );
    }

    const res = await pool.query(
      `
      INSERT INTO packaging_rules (
        name, packaging_type_id, min_weight_kg, max_weight_kg, 
        min_order_amount, max_order_amount, priority, store_id, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *
      `,
      [
        name,
        packaging_type_id,
        Number(min_weight_kg) || 0,
        max_weight_kg === "" ? null : Number(max_weight_kg),
        Number(min_order_amount) || 0,
        max_order_amount === "" ? null : Number(max_order_amount),
        parseInt(priority, 10) || 0,
        store_id,
      ],
    );

    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const store_id = searchParams.get("store_id");

    if (!id || !store_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Context indicators mapping parameters missing.",
        },
        { status: 400 },
      );
    }

    // Verify ownership security parameters scope layout limits
    const result = await pool.query(
      "DELETE FROM packaging_rules WHERE id = $1 AND store_id = $2 RETURNING id",
      [id, store_id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Target rule not found or unowned by tenant" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
