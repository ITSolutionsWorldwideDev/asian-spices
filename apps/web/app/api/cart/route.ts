// apps/web/app/api/cart/route.ts

import { pool } from "@acme/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";

// ✅ GET CART
export async function GET() {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 }); // allow guest fallback
  }

  // 1️⃣ Get cart
  const cartRes = await pool.query(
    `SELECT id FROM store_carts WHERE customer_id = $1 LIMIT 1`,
    [session.user.id],
  );

  if (cartRes.rows.length === 0) return NextResponse.json([]);

  const cartId = cartRes.rows[0].id;

  // 2️⃣ Get items
  const items = await pool.query(
    `SELECT * FROM store_cart_items WHERE cart_id = $1`,
    [cartId],
  );

  return NextResponse.json(items.rows);
}


export async function POST(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { product_id, price, quantity } = await req.json();

  // 1️⃣ Find or create cart
  let cartRes = await pool.query(
    `SELECT id FROM store_carts WHERE customer_id = $1 LIMIT 1`,
    [session.user.id],
  );

  let cartId;

  if (cartRes.rows.length === 0) {
    const newCart = await pool.query(
      `INSERT INTO store_carts (customer_id, store_id)
       VALUES ($1, $2)
       RETURNING id`,
      [session.user.id, "YOUR_STORE_ID"], // ⚠️ replace
    );

    cartId = newCart.rows[0].id;
  } else {
    cartId = cartRes.rows[0].id;
  }

  // 2️⃣ Insert or update item
  const result = await pool.query(
    `INSERT INTO store_cart_items (cart_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET quantity = store_cart_items.quantity + $3
     RETURNING *`,
    [cartId, product_id, quantity, price],
  );

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(webAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const { product_id } = await req.json();

  const cartRes = await pool.query(
    `SELECT id FROM store_carts WHERE customer_id = $1 LIMIT 1`,
    [session.user.id],
  );

  if (cartRes.rows.length === 0) {
    return NextResponse.json({ success: true });
  }

  const cartId = cartRes.rows[0].id;

  await pool.query(
    `DELETE FROM store_cart_items WHERE cart_id = $1 AND product_id = $2`,
    [cartId, product_id],
  );

  return NextResponse.json({ success: true });
}

/*

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
} */
