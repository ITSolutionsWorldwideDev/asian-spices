// apps/web/app/api/account/addresses/[id]/default/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";
import { pool } from "@acme/db";

export async function POST(_: Request, { params }: any) {
  const { id } = params;

  const client = await pool.connect();

  await client.query(
    `UPDATE store_customer_addresses 
     SET is_default = false WHERE customer_id = (
       SELECT customer_id FROM store_customer_addresses WHERE id = $1
     )`,
    [id],
  );

  await client.query(
    `UPDATE store_customer_addresses SET is_default = true WHERE id = $1`,
    [id],
  );

  client.release();

  return Response.json({ success: true });
}

export async function PATCH(
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
    await client.query("BEGIN");

    // get customer
    const { rows } = await client.query(
      `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
      [session.user.id],
    );

    const customer_id = rows[0]?.id;

    // remove existing default
    await client.query(
      `UPDATE store_customer_addresses
       SET is_default = false
       WHERE customer_id = $1`,
      [customer_id],
    );

    // set new default
    await client.query(
      `UPDATE store_customer_addresses
       SET is_default = true
       WHERE id = $1`,
      [id],
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
