import { NextRequest, NextResponse } from "next/server";
// import { pool } from "@/lib/db"; // your postgres connection
import { pool } from "@acme/db";
import { randomUUID } from "crypto";
export async function POST(req: NextRequest) {
  const store_id = randomUUID();
  //  const customers_id = randomUUID();
  const client = await pool.connect();

  try {
    const body = await req.json();

    const {
      customer,
      shippingAddress,
      cartItems,
      pricing,
      // store_id,
    } = body;

    await client.query("BEGIN");

    // 1️⃣ Insert Customer
    const customerResult = await client.query(
      `
      INSERT INTO store_customers 
      ( first_name, last_name, email, phone, city, postcode)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id
      `,
      [
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        shippingAddress.city,
        shippingAddress.zip,
      ],
    );

    const customer_id = customerResult.rows[0].id;

    // 2️⃣ Insert Address
    await client.query(
      `
      INSERT INTO store_customer_addresses
       (store_id,customer_id,label, address_line1, address_line2, city, state, postal_code, country)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        store_id,
        customer_id,
        "Home",
        shippingAddress.address_line1,
        shippingAddress.appartment,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zip,
        shippingAddress.country,
      ],
    );

    // 3️⃣ Create Order
    const orderResult = await client.query(
      `
      INSERT INTO store_orders
      ( order_number, customer_id, subtotal, discount_amount, shipping_amount, total_amount)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id
      `,
      [
        `ORD-${Date.now()}`,
        customer_id,
        pricing.subtotal,
        pricing.discount,
        pricing.shipping,
        pricing.total,
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
        [order_id, item.id, item.quantity, item.price],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      order_id,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Checkout failed" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
