// /app/api/orders/[orderId]/fulfill/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import {
  resolveOrderStatus,
  assignNextStore,
  logOrderEvent,
  ORDER_EVENTS,
} from "@acme/order-routing";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const client = await pool.connect();

  try {
    const store = await getCurrentStoreAPI(req);
    const storeId = store.id;

    const { orderId } = await params;
    const { action, items } = await req.json();

    await client.query("BEGIN");

    // 🔒 lock allocations
    const { rows: allocations } = await client.query(
      `SELECT * FROM order_item_allocations
       WHERE order_id = $1 AND store_id = $2
       FOR UPDATE`,
      [orderId, storeId]
    );

    if (!allocations.length) {
      throw new Error("No allocations for this store");
    }

    // =====================
    // ✅ FULL
    // =====================
    if (action === "full") {
      for (const alloc of allocations) {
        await client.query(
          `UPDATE store_products
           SET quantity = quantity - $1
           WHERE id = (
             SELECT product_id FROM store_order_items WHERE id = $2
           )`,
          [alloc.allocated_quantity, alloc.order_item_id]
        );

        await client.query(
          `UPDATE order_item_allocations
           SET fulfilled_quantity = allocated_quantity,
               status = 'fulfilled'
           WHERE id = $1`,
          [alloc.id]
        );

        await client.query(
          `UPDATE store_order_items
           SET fulfilled_quantity = COALESCE(fulfilled_quantity,0) + $1
           WHERE id = $2`,
          [alloc.allocated_quantity, alloc.order_item_id]
        );
      }

      await logOrderEvent(client, {
        orderId,
        eventType: ORDER_EVENTS.ACCEPTED,
        storeId,
        message: "Full fulfillment",
      });
    }

    // =====================
    // ⚠️ PARTIAL
    // =====================
    if (action === "partial") {
      for (const alloc of allocations) {
        const userItem = items?.find(
          (i: any) => i.allocation_id === alloc.id
        );

        const fulfillQty = userItem
          ? Math.min(userItem.quantity, alloc.allocated_quantity)
          : 0;

        await client.query(
          `UPDATE store_products
           SET quantity = quantity - $1
           WHERE id = (
             SELECT product_id FROM store_order_items WHERE id = $2
           )`,
          [fulfillQty, alloc.order_item_id]
        );

        await client.query(
          `UPDATE order_item_allocations
           SET fulfilled_quantity = $1,
               status = CASE
                 WHEN $1 = 0 THEN 'rejected'
                 WHEN $1 < allocated_quantity THEN 'partial'
                 ELSE 'fulfilled'
               END
           WHERE id = $2`,
          [fulfillQty, alloc.id]
        );

        await client.query(
          `UPDATE store_order_items
           SET fulfilled_quantity = COALESCE(fulfilled_quantity,0) + $1
           WHERE id = $2`,
          [fulfillQty, alloc.order_item_id]
        );
      }

      await logOrderEvent(client, {
        orderId,
        eventType: ORDER_EVENTS.PARTIAL,
        storeId,
        message: "Partial fulfillment",
      });

      // 🔁 route remaining items
      await assignNextStore(client, orderId);
    }

    await resolveOrderStatus(client, orderId);

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}