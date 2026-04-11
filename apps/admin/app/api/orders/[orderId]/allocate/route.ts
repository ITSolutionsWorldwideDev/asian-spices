// /app/api/orders/[orderId]/allocate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";
import {
  assignNextStore,
  logOrderEvent,
  ORDER_EVENTS,
  resolveOrderStatus,
} from "@/lib/order-routing";

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

    // mark current attempt
    await client.query(
      `
      UPDATE order_routing_attempts
      SET status = $1, responded_at = NOW()
      WHERE order_id = $2 AND store_id = $3 AND status = 'pending'
    `,
      [action === "reject" ? "rejected" : "accepted", orderId, storeId],
    );

    // REJECT → RE-ROUTE
    if (action === "reject") {
      await client.query(
        `
        UPDATE store_orders
        SET rejection_count = rejection_count + 1
        WHERE id = $1
      `,
        [orderId],
      );

      await assignNextStore(client, orderId);

      await logOrderEvent(client, {
        orderId,
        // eventType: "rejected",
        eventType: ORDER_EVENTS.REJECTED,
        storeId,
        message: "Store rejected the order",
      });

      await client.query("COMMIT");
      return NextResponse.json({ success: true });
    }

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

        await client.query(
          `
          INSERT INTO order_item_allocations
          (order_id, order_item_id, store_id, allocated_quantity)
          VALUES ($1,$2,$3,$4)
          ON CONFLICT DO NOTHING
          `,
          [orderId, item.id, storeId, item.quantity],
        );
      }

      await client.query(
        `UPDATE store_orders
         SET order_status = 'confirmed', 
            fulfillment_status = 'fulfilled'
         WHERE id = $1`,
        [orderId],
      );

      await resolveOrderStatus(client, orderId);

      await logOrderEvent(client, {
        orderId,
        eventType: ORDER_EVENTS.ACCEPTED,
        storeId,
        message: "Store accepted full order",
      });
    }

    // =========================
    // ⚠️ CASE 3: PARTIAL
    // =========================
    if (action === "partial") {
      for (const item of orderItems) {
        const userItem = items?.find((i: any) => i.item_id === item.id);

        const fulfillQty = userItem
          ? Math.min(userItem.fulfilled_quantity, item.stock)
          : 0;

        // deduct stock
        await client.query(
          `UPDATE store_products
           SET quantity = quantity - $1
           WHERE id = $2`,
          [fulfillQty, item.product_id],
        );

        // update allocation (🔥 NEW)
        await client.query(
          `
          UPDATE order_item_allocations
          SET fulfilled_quantity = $1,
              status = CASE
                WHEN $1 = 0 THEN 'rejected'
                WHEN $1 < allocated_quantity THEN 'partial'
                ELSE 'fulfilled'
              END
          WHERE order_item_id = $2 AND store_id = $3
          `,
          [fulfillQty, item.id, storeId],
        );

        // update order item
        await client.query(
          `
            UPDATE store_order_items
            SET 
              fulfilled_quantity = COALESCE(fulfilled_quantity,0) + $1,
              status = CASE
                WHEN COALESCE(fulfilled_quantity,0) + $1 = quantity THEN 'fulfilled'
                WHEN COALESCE(fulfilled_quantity,0) + $1 = 0 THEN 'pending'
                ELSE 'partial'
              END
            WHERE id = $2
          `,
          [fulfillQty, item.id],
        );
        // await client.query(
        //   `
        //   UPDATE store_order_items
        //   SET fulfilled_quantity = COALESCE(fulfilled_quantity,0) + $1
        //   WHERE id = $2
        //   `,
        //   [fulfillQty, item.id],
        // );

        await client.query(
          `
          INSERT INTO order_item_allocations
          (order_id, order_item_id, store_id, allocated_quantity)
          VALUES ($1,$2,$3,$4)
          ON CONFLICT DO NOTHING
          `,
          [orderId, item.id, storeId, item.quantity],
        );
      }

      await client.query(
        `UPDATE store_orders
         SET order_status = 'partially_confirmed',
             fulfillment_status = 'partial'
         WHERE id = $1`,
        [orderId],
      );

      // 🔥 route remaining items
      await resolveOrderStatus(client, orderId);
      await assignNextStore(client, orderId);

      await logOrderEvent(client, {
        orderId,
        eventType: ORDER_EVENTS.PARTIAL,
        storeId,
        message: "Store partially fulfilled order",
      });
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
