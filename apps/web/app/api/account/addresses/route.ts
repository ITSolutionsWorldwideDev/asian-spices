// apps/web/app/api/account/addresses/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";
import { pool } from "@acme/db";
import { addressSchema } from "@/lib/validation/account";

export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `
      SELECT a.*
      FROM store_customer_addresses a
      JOIN store_customers c ON c.id = a.customer_id
      WHERE c.user_id = $1
      ORDER BY a.created_at DESC
      `,
      [session.user.id],
    );

    return NextResponse.json({ addresses: rows });
  } finally {
    client.release();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const client = await pool.connect();

  try {
    const { rows: customerRows } = await client.query(
      `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
      [session.user.id],
    );

    const customer_id = customerRows[0]?.id;

    if (!customer_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = parsed;

    await client.query(
      `
      INSERT INTO store_customer_addresses
      (store_id, customer_id, label, address_line1, address_line2, city, state, postal_code, country)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        null,
        customer_id,
        data.label,
        data.address_line1,
        data.address_line2,
        data.city,
        data.state,
        data.postal_code,
        data.country,
      ],
    );

    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}
