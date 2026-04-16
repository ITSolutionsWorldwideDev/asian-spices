// apps/admin/app/api/platform/shipping/providers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { encrypt } from "@/lib/crypto";

export async function POST(req: NextRequest) {

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { name, slug, is_active, apiKey, apiSecret } = await req.json();

    const result = await client.query(
      `
      INSERT INTO shipping_providers (name, slug, is_active)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [name, slug, is_active]
    );

    const providerId = result.rows[0].id;

    // store encrypted credentials
    if (apiKey || apiSecret) {
      await client.query(
        `
        INSERT INTO shipping_provider_credentials (provider_id, api_key, api_secret)
        VALUES
          ($1, 'api_key', $2),
          ($1, 'api_secret', $3)
        `,
        [
          providerId,
          encrypt(apiKey || ""),
          encrypt(apiSecret || ""),
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to create provider" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {

  const client = await pool.connect();
  try {
    
    await client.query("BEGIN");
    const { id, name, slug, is_active, apiKey, apiSecret } =
      await req.json();

    await client.query(
      `
      UPDATE shipping_providers
      SET name = $1, slug = $2, is_active = $3
      WHERE id = $4
      `,
      [name, slug, is_active, id]
    );

    if (apiKey) {
      await client.query(
        `
        UPDATE shipping_provider_credentials
        SET api_secret = $1
        WHERE provider_id = $2 AND api_key = 'api_key'
        `,
        [encrypt(apiKey), id]
      );
    }

    if (apiSecret) {
      await client.query(
        `
        UPDATE shipping_provider_credentials
        SET api_secret = $1
        WHERE provider_id = $2 AND api_key = 'api_secret'
        `,
        [encrypt(apiSecret), id]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}