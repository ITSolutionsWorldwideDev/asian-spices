// apps/web/app/api/wishlist/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";
import { pool } from "@acme/db";

export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();

  const items = await client.query(
    `
        SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.category_slug,
        (
            SELECT url
            FROM product_images pi
            WHERE pi.product_id = p.id
            LIMIT 1
        ) as image
        FROM wishlists w
        JOIN products p ON p.id = w.product_id
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC
    `,
    [session.user.id],
  );

  return NextResponse.json(items.rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();

  const { product_id } = await req.json();

  await client.query(
    `
        INSERT INTO wishlists(user_id, product_id)
        VALUES($1, $2)
        ON CONFLICT(user_id, product_id) DO NOTHING
    `,
    [session.user.id, product_id],
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const client = await pool.connect();

  const { product_id } = await req.json();

  await client.query(
    `
        DELETE FROM wishlists
        WHERE user_id = $1
        AND product_id = $2
    `,
    [session.user.id, product_id],
  );

  return NextResponse.json({ success: true });
}
