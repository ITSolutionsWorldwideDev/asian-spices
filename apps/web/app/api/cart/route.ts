// app/api/cart/route.ts
// import { db } from "@/lib/db"; // your postgres/drizzle/prisma client
import { pool } from "@acme/db";
// import { auth } from "@/auth";  // your auth helper (NextAuth, Clerk, etc.)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";
// GET — fetch cart from DB
export async function GET() {
  const session = await getServerSession(webAuthOptions);
  console.log(session);
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const items = await pool.query(
    `SELECT * FROM cart_items WHERE user_id = $1`,
    [session.user.id],
  );
  return NextResponse.json(items.rows);
}

// POST — add/update item
export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { product_id, title, price, quantity, image } = await req.json();

  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, title, price, quantity, image)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + $5
     RETURNING *`,
    [session.user.id, product_id, title, price, quantity, image],
  );
  return NextResponse.json(result.rows[0]);
}

// DELETE — remove item
export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { product_id } = await req.json();
  await pool.query(
    `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
    [session.user.id, product_id],
  );
  return NextResponse.json({ success: true });
}
