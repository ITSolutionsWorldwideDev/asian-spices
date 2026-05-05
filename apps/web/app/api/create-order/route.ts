// apps/web/app/api/create-order/route.tsx

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { randomUUID } from "crypto";

import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  const session = await getServerSession(webAuthOptions);
  const userId = session?.user?.id || null;
  const userEmail = session?.user?.email || null;

  try {
    const body = await req.json();

    const { customer, shippingAddress, cartItems, pricing } = body;

    const email = userId ? userEmail : customer.email;

    const { latitude, longitude } = shippingAddress;

    if (!latitude || !longitude) {
      return errorResponse(
        "Please enter a valid delivery address to continue.",
        "MISSING_LOCATION",
      );
    }

    await client.query("BEGIN");

    let customer_id: string;

    // =========================================
    // 1️⃣ CUSTOMER (ALWAYS store_customers)
    // =========================================
    if (userId) {
      // 🔍 find existing store_customer
      const existing = await client.query(
        `SELECT id FROM store_customers WHERE user_id = $1 LIMIT 1`,
        [userId],
      );

      if (existing.rowCount) {
        customer_id = existing.rows[0].id;
      } else {
        const result = await client.query(
          `INSERT INTO store_customers 
           (user_id, first_name, last_name, email, phone, city, postcode)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           RETURNING id`,
          [
            userId,
            customer.firstName,
            customer.lastName,
            email,
            customer.phone,
            shippingAddress.city,
            shippingAddress.postal_code,
          ],
        );

        customer_id = result.rows[0].id;
      }
    } else {
      // =========================================
      // 👤 GUEST FLOW
      // =========================================
      const result = await client.query(
        `INSERT INTO store_customers 
         (first_name, last_name, email, phone, city, postcode)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id`,
        [
          customer.firstName,
          customer.lastName,
          email,
          customer.phone,
          shippingAddress.city,
          shippingAddress.postal_code,
        ],
      );

      customer_id = result.rows[0].id;

      // 🔥 optional: create user account
      const userCheck = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email],
      );

      if (userCheck.rowCount === 0) {
        const bcrypt = require("bcryptjs");
        const tempPassword = Math.random().toString(36).slice(-8);
        const hash = await bcrypt.hash(tempPassword, 10);

        const newUser = await client.query(
          `INSERT INTO users (email, password_hash)
           VALUES ($1,$2)
           RETURNING id`,
          [email, hash],
        );

        const newUserId = newUser.rows[0].id;

        await client.query(
          `UPDATE store_customers 
           SET user_id = $1 
           WHERE id = $2`,
          [newUserId, customer_id],
        );
      }
    }

    // =========================================
    // 2️⃣ ADDRESS
    // =========================================

    const addressRes = await client.query(
      `INSERT INTO store_customer_addresses
      (customer_id, label, address_line1, address_line2, city, state, postal_code, country)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (customer_id, address_line1, address_line2, city, state, postal_code, country)
      DO NOTHING
      RETURNING id`,
      [
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
    /* await client.query(
      `INSERT INTO store_customer_addresses
       (customer_id, label, address_line1, address_line2, city, state, postal_code, country)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        customer_id,
        "Home",
        shippingAddress.address_line1,
        shippingAddress.address_line2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postal_code,
        shippingAddress.country,
      ],
    ); */

    // =========================================
    // 3️⃣ FIND STORES
    // =========================================
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
      return errorResponse(
        "We don't deliver to your location yet.",
        "NO_NEARBY_STORES",
      );
    }

    const storeIds = nearestStores.map((s) => s.store_id);
    const productIds = cartItems.map((item: any) => item.id);

    const catalogResult = await client.query(
      `
      SELECT store_id, product_id, price, 9999 AS quantity
      FROM store_product_catalog
      WHERE product_id = ANY($1) AND store_id = ANY($2)
      `,
      [productIds, storeIds],
    );

    const catalog = catalogResult.rows;

    const bestStore = selectBestStore(nearestStores, cartItems, catalog);

    if (!bestStore) {
      return errorResponse(
        "Sorry, no nearby store has all items in stock.",
        "NO_STORE_AVAILABLE",
      );
    }

    // =========================================
    // 4️⃣ CREATE ORDER
    // =========================================
    const orderResult = await client.query(
      `INSERT INTO store_orders
        (store_id, current_store_id, order_number, customer_id, customer_email, order_status,
         subtotal, discount_amount, shipping_amount, total_amount, payment_status,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      shipping_latitude,
      shipping_longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
      $12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING id`,
      [
        bestStore,
        bestStore,
        `ORD-${Date.now()}`,
        customer_id,
        email,
        "pending",
        pricing.subtotal,
        pricing.discount,
        pricing.shipping,
        pricing.total,
        "pending",
        shippingAddress.address_line1,
        shippingAddress.address_line2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postal_code,
        shippingAddress.country,
        shippingAddress.latitude,
        shippingAddress.longitude,
      ],
    );

    const order_id = orderResult.rows[0].id;

    // =========================================
    // 5️⃣ ORDER ITEMS
    // =========================================
    for (const item of cartItems) {
      const product = catalog.find(
        (c) => c.store_id === bestStore && c.product_id === item.id,
      );

      if (!product || product.quantity < item.quantity) {
        return errorResponse(`${item.title} is out of stock`, "OUT_OF_STOCK");
      }

      await client.query(
        `INSERT INTO store_order_items (order_id, product_id, quantity, price)
         VALUES ($1,$2,$3,$4)`,
        [order_id, item.id, item.quantity, Number(product.price)],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: order_id,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");

    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Order creation failed",
      },
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

const errorResponse = (message: string, code: string, status = 400) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
    },
    { status },
  );
};

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

/* 

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  const session = await getServerSession(webAuthOptions);
  const userId = session?.user?.id || null;
  const userEmail = session?.user?.email || null;

  try {
    const body = await req.json();

    const { customer, shippingAddress, cartItems, pricing } = body;

    const email = userId ? userEmail : customer.email;

    const { latitude, longitude } = shippingAddress;

    if (!latitude || !longitude) {
      return errorResponse(
        "Please enter a valid delivery address to continue.",
        "MISSING_LOCATION",
      );
    }

    const store_id = randomUUID();

    await client.query("BEGIN");

    // 1️⃣ Insert Customer

    let customer_id: string;

    // 1️⃣ If logged in → try to find existing customer
    if (userId) {
      const existingCustomer = await client.query(
        `SELECT id FROM customers WHERE user_id = $1 LIMIT 1`,
        [userId],
      );

      if (existingCustomer.rowCount) {
        customer_id = existingCustomer.rows[0].id;
      } else {
        const result = await client.query(
          `INSERT INTO customers (user_id, email, first_name, last_name, phone)
          VALUES ($1,$2,$3,$4,$5)
          RETURNING id`,
          [
            userId,
            email,
            customer.firstName,
            customer.lastName,
            customer.phone,
          ],
        );

        customer_id = result.rows[0].id;
      }

      // 🔥 assign CUSTOMER role
      await client.query(
        `INSERT INTO store_users (user_id, store_id, role_id)
          SELECT $1, $2, id FROM roles 
          WHERE key = 'customer'
          AND NOT EXISTS (
            SELECT 1 FROM store_users 
            WHERE user_id = $1 AND store_id = $2
          )`,
        [userId, store_id],
      );
    } else {
      // ✅ GUEST FLOW
      const customerResult = await client.query(
        `INSERT INTO store_customers 
          (store_id, first_name, last_name, email, phone, city, postcode)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          RETURNING id`,
        [
          store_id,
          customer.firstName,
          customer.lastName,
          email,
          customer.phone,
          shippingAddress.city,
          shippingAddress.zip,
        ],
      );

      customer_id = customerResult.rows[0].id;

      const userCheck = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [email],
      );

      if (userCheck.rowCount === 0) {
        const bcrypt = require("bcryptjs");
        const tempPassword = Math.random().toString(36).slice(-8);

        const hash = await bcrypt.hash(tempPassword, 10);

        const newUser = await client.query(
          `INSERT INTO users (email, password_hash)
          VALUES ($1,$2)
          RETURNING id`,
          [email, hash],
        );

        const newUserId = newUser.rows[0].id;

        // link customer
        await client.query(
          `UPDATE store_customers SET user_id = $1 WHERE id = $2`,
          [newUserId, customer_id],
        );

        // assign role
        await client.query(
          `INSERT INTO store_users (user_id, store_id, role_id)
            SELECT $1, $2, id FROM roles 
            WHERE key = 'customer'
            AND NOT EXISTS (
              SELECT 1 FROM store_users 
              WHERE user_id = $1 AND store_id = $2
            )`,
          [newUserId, store_id],
        );
      }
    }

    console.log("store_customer_addresses customer_id ==== ", customer_id);

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
      return errorResponse(
        "We don't deliver to your location yet.",
        "NO_NEARBY_STORES",
      );
    }

    const storeIds = nearestStores.map((s) => s.store_id);

    const productIds = cartItems.map((item: any) => item.id);

    // 4️⃣ Fetch catalog for nearby stores
    const catalogResult = await client.query(
      `
      SELECT store_id, product_id, price, 9999 AS quantity
      FROM store_product_catalog
      WHERE product_id = ANY($1) AND store_id = ANY($2)
      `,
      [productIds, storeIds],
    );
    const catalog = catalogResult.rows;

    console.log("nearestStores === ", nearestStores);
    console.log("cartItems === ", cartItems);
    console.log("catalog === ", catalog);

    // 5️⃣ Select best store (lowest price, available stock)
    const bestStore = selectBestStore(nearestStores, cartItems, catalog);

    console.log("bestStore === ", bestStore);

    if (!bestStore) {
      return errorResponse(
        "Sorry, no nearby store has all items in stock. Please adjust your cart.",
        "NO_STORE_AVAILABLE",
      );
    }

    const orderResult = await client.query(
      `INSERT INTO store_orders
        (store_id, order_number, customer_id, customer_email, order_status, subtotal, discount_amount, shipping_amount, total_amount, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        bestStore,
        `ORD-${Date.now()}`,
        customer_id,
        customer.email,
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
        // throw new Error(`Insufficient stock for product ${item.id}`);
        return errorResponse(
          `Product ${item.title} is out of stock`,
          "OUT_OF_STOCK",
        );
      }

      await client.query(
        `INSERT INTO store_order_items (order_id, product_id, quantity, price)
         VALUES ($1,$2,$3,$4)`,
        [order_id, item.id, item.quantity, Number(product.price)],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: order_id,
      storeId: bestStore,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Order creation failed",
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
*/

/*  const customerResult = await client.query(
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

    const customer_id = customerResult.rows[0].id; */

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
