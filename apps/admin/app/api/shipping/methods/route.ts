// apps/admin/app/api/shipping/methods/route.ts


import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function POST(req: NextRequest) {
  try {
    const store = await getCurrentStoreAPI(req);
    const body = await req.json();

    const { name, provider_id, type } = body;

    const result = await pool.query(
      `
      INSERT INTO shipping_methods (store_id, name, provider_id, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [store.id, name, provider_id, type]
    );

    return NextResponse.json({ success: true, method: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}