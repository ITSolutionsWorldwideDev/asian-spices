// apps/web/app/api/create-order/route.tsx

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await req.json();

    const { customer, shippingAddress, cartItems, pricing } = body;

    const { latitude, longitude } = shippingAddress;

    if (!latitude || !longitude) {
      throw new Error("Customer location required for store selection");
    }

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

    // 3️⃣ Find nearest stores
    const storesResult = await client.query(
      `
      SELECT sa.store_id,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(sa.latitude)) *
            cos(radians(sa.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(sa.latitude))
          )
        ) AS distance
      FROM store_addresses sa
      WHERE sa.latitude IS NOT NULL AND sa.longitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT 10
      `,
      [latitude, longitude],
    );
    const nearestStores = storesResult.rows;

    if (!nearestStores.length) {
      throw new Error("No nearby stores found");
    }

    const storeIds = nearestStores.map((s) => s.store_id);

    const productIds = cartItems.map((item: any) => item.id);

    // 4️⃣ Fetch catalog for nearby stores
    const catalogResult = await client.query(
      `
      SELECT store_id, product_id, price, quantity
      FROM store_product_catalog
      WHERE product_id = ANY($1) AND store_id = ANY($2)
      `,
      [productIds, storeIds],
    );
    const catalog = catalogResult.rows;

    // 5️⃣ Select best store (lowest price, available stock)
    const bestStore = selectBestStore(nearestStores, cartItems, catalog);

    if (!bestStore) {
      throw new Error("No store can fulfill this order");
    }

    // 6️⃣ Create Order
    // const orderResult = await client.query(
    //   `
    //   INSERT INTO store_orders
    //   (order_number, customer_id, order_status, subtotal, discount_amount, shipping_amount, total_amount, payment_status)
    //   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    //   RETURNING id
    //   `,
    //   [
    //     `ORD-${Date.now()}`,
    //     customer_id,
    //     "pending",
    //     pricing.subtotal,
    //     pricing.discount,
    //     pricing.shipping,
    //     pricing.total,
    //     "pending",
    //   ],
    // );

    const orderResult = await client.query(
      `INSERT INTO store_orders
        (store_id, order_number, customer_id, order_status, subtotal, discount_amount, shipping_amount, total_amount, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        bestStore,
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

    // 7️⃣ Insert Order Items
    for (const item of cartItems) {
      const product = catalog.find(
        (c) => c.store_id === bestStore && c.product_id === item.id,
      );

      if (!product || product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.id}`);
      }

      await client.query(
        `INSERT INTO store_order_items (order_id, product_id, quantity, price)
         VALUES ($1,$2,$3,$4)`,
        [order_id, item.id, item.quantity, Number(product.price)],
      );
    }
    // for (const item of cartItems) {
    //   await client.query(
    //     `
    //     INSERT INTO store_order_items
    //     (order_id, product_id, quantity, price)
    //     VALUES ($1,$2,$3,$4)
    //     `,
    //     [
    //       order_id,
    //       item.id,
    //       item.quantity,
    //       Number(item.price), // 🔥 FIX (string → number)
    //     ],
    //   );
    // }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: order_id,
      storeId: bestStore,
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

// -----------------------
// Helper function
// -----------------------
const selectBestStore = (stores: any[], cartItems: any[], catalog: any[]) => {
  let bestStore = null;
  let bestScore = Infinity;

  for (const store of stores) {
    const storeId = store.store_id;
    let total = 0;
    let valid = true;

    for (const item of cartItems) {
      const product = catalog.find(
        (c) => c.store_id === storeId && c.product_id === item.id,
      );
      if (!product || product.quantity < item.quantity) {
        valid = false;
        break;
      }
      total += Number(product.price) * item.quantity;
    }

    if (!valid) continue;

    // score = total price + small distance weight
    const score = total + store.distance * 0.01;
    if (score < bestScore) {
      bestScore = score;
      bestStore = storeId;
    }
  }

  return bestStore;
};
