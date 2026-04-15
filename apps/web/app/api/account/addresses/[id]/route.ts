// apps/web/app/api/account/addresses/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";
import { pool } from "@acme/db";
import { addressSchema } from "@/lib/validation/account";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;

  const client = await pool.connect();

  try {
    await client.query(
      `
      UPDATE store_customer_addresses
      SET label=$1, address_line1=$2, address_line2=$3,
          city=$4, state=$5, postal_code=$6, country=$7
      WHERE id = $8
      `,
      [
        parsed.data.label,
        parsed.data.address_line1,
        parsed.data.address_line2,
        parsed.data.city,
        parsed.data.state,
        parsed.data.postal_code,
        parsed.data.country,
        id,
      ],
    );

    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  const { id } = await params;

  try {
    await client.query(
      `DELETE FROM store_customer_addresses WHERE id = $1`,
      [id],
    );

    return NextResponse.json({ success: true });
  } finally {
    client.release();
  }
}