// apps/admin/app/api/platform/shipping/store-providers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { encrypt } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const { storeId, providerId, is_enabled, apiKey, apiSecret } =
      await req.json();

    if (!storeId || !providerId) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    const encrypted =
      apiKey && apiSecret
        ? encrypt(JSON.stringify({ apiKey, apiSecret }))
        : null;

    const result = await pool.query(
      `
      INSERT INTO store_shipping_providers 
      (store_id, provider_id, is_enabled, credentials)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (store_id, provider_id)
      DO UPDATE SET
        is_enabled = EXCLUDED.is_enabled,
        credentials = COALESCE(EXCLUDED.credentials, store_shipping_providers.credentials),
        updated_at = NOW()
      RETURNING *
      `,
      [storeId, providerId, is_enabled, encrypted],
    );

    return NextResponse.json({
      success: true,
      assignment: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}