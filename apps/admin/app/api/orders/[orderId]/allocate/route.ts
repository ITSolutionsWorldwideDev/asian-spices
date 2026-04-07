// /app/api/orders/[orderId]/allocate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const client = await pool.connect();

  try {
    const store = await getCurrentStoreAPI(req);
    const storeId = store.id;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not resolved" },
        { status: 400 },
      );
    }

    const { orderId } = await params;

    const { action, items } = await req.json();

    await client.query("BEGIN");

    // 🔹 Get order items + product stock
    const { rows: orderItems } = await client.query(
      `
      SELECT oi.id, oi.product_id, oi.quantity, p.quantity as stock
      FROM store_order_items oi
      JOIN store_products p ON p.id = oi.product_id
      WHERE oi.order_id = $1
      FOR UPDATE
      `,
      [orderId],
    );

    if (!orderItems.length) throw new Error("No items found");

    // =========================
    // ✅ CASE 1: FULL ACCEPT
    // =========================
    if (action === "full") {
      for (const item of orderItems) {
        if (item.stock < item.quantity) {
          throw new Error("Insufficient stock for full allocation");
        }

        // deduct stock
        await client.query(
          `UPDATE store_products
           SET quantity = quantity - $1
           WHERE id = $2`,
          [item.quantity, item.product_id],
        );

        // mark fulfilled
        await client.query(
          `UPDATE store_order_items
           SET fulfilled_quantity = $1, status = 'fulfilled'
           WHERE id = $2`,
          [item.quantity, item.id],
        );
      }

      await client.query(
        `UPDATE store_orders
         SET order_status = 'confirmed', fulfillment_status = 'fulfilled'
         WHERE id = $1`,
        [orderId],
      );
    }

    // =========================
    // ❌ CASE 2: REJECT
    // =========================
    if (action === "reject") {
      await client.query(
        `UPDATE store_orders
         SET order_status = 'rejected', fulfillment_status = 'cancelled'
         WHERE id = $1`,
        [orderId],
      );

      await client.query(
        `UPDATE store_order_items
         SET status = 'cancelled'
         WHERE order_id = $1`,
        [orderId],
      );
    }

    // =========================
    // ⚠️ CASE 3: PARTIAL
    // =========================
    if (action === "partial") {
      for (const item of orderItems) {
        const userItem = items?.find((i: any) => i.item_id === item.id);

        const fulfillQty = userItem
          ? Math.min(userItem.fulfilled_quantity, item.stock)
          : Math.min(item.quantity, item.stock);

        // deduct stock
        await client.query(
          `UPDATE store_products
           SET quantity = quantity - $1
           WHERE id = $2`,
          [fulfillQty, item.product_id],
        );

        // update item
        await client.query(
          `UPDATE store_order_items
           SET fulfilled_quantity = $1,
               status = CASE
                 WHEN $1 = 0 THEN 'out_of_stock'
                 WHEN $1 < quantity THEN 'partial'
                 ELSE 'fulfilled'
               END
           WHERE id = $2`,
          [fulfillQty, item.id],
        );
      }

      await client.query(
        `UPDATE store_orders
         SET order_status = 'partially_confirmed',
             fulfillment_status = 'partial'
         WHERE id = $1`,
        [orderId],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}
