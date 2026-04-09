// apps/web/app/api/create-order/route.tsx

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await req.json();

    const { customer, shippingAddress, cartItems, pricing } = body;

    const store_id = randomUUID();

    await client.query("BEGIN");

    // 1️⃣ Insert Customer
    const customerResult = await client.query(
      `
      INSERT INTO store_customers 
      (first_name, last_name, email, phone, city, postcode)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id
      `,
      [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        shippingAddress.city,
        shippingAddress.postal_code,
      ],
    );

    const customer_id = customerResult.rows[0].id;

    // 2️⃣ Insert Address
    await client.query(
      `
      INSERT INTO store_customer_addresses
      (store_id, customer_id, label, address_line1, address_line2, city, state, postal_code, country)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        store_id,
        customer_id,
        "Home",
        shippingAddress.address_line1,
        shippingAddress.address_line2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postal_code,
        shippingAddress.country,
      ],
    );

    // 3️⃣ Create Order (IMPORTANT: add status)
    const orderResult = await client.query(
      `
      INSERT INTO store_orders
      (order_number, customer_id, order_status, subtotal, discount_amount, shipping_amount, total_amount, payment_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        `ORD-${Date.now()}`,
        customer_id,
        "pending",
        pricing.subtotal,
        pricing.discount,
        pricing.shipping,
        pricing.total,
        "pending",
      ],
    );

    const order_id = orderResult.rows[0].id;

    // 4️⃣ Insert Order Items
    for (const item of cartItems) {
      await client.query(
        `
        INSERT INTO store_order_items
        (order_id, product_id, quantity, price)
        VALUES ($1,$2,$3,$4)
        `,
        [
          order_id,
          item.id,
          item.quantity,
          Number(item.price), // 🔥 FIX (string → number)
        ],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: order_id,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create order error:", error);

    return NextResponse.json(
      { success: false, error: "Order creation failed" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
