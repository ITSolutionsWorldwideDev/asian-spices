// apps/admin/app/api/cron/order-timeout/route.ts

import { NextResponse } from "next/server";
import { pool } from "@acme/db";
import {
  assignNextStore,
  isTimeoutExceeded,
  logOrderEvent,
  ORDER_EVENTS,
} from "@/lib/order-routing";

export async function GET() {
  const client = await pool.connect();

  try {
    // 🔹 get all pending attempts
    const { rows: attempts } = await client.query(`
      SELECT 
        ora.*,
        o.id as order_id,
        o.created_at,
        s.id as store_id
      FROM order_routing_attempts ora
      JOIN store_orders o ON o.id = ora.order_id
      JOIN stores s ON s.id = ora.store_id
      WHERE ora.status = 'pending'
    `);

    for (const attempt of attempts) {
      const isExpired = await isTimeoutExceeded(client, attempt);

      if (!isExpired) continue;

      await client.query("BEGIN");

      // ❌ mark attempt rejected
      await client.query(
        `
        UPDATE order_routing_attempts
        SET status = 'rejected',
            responded_at = NOW()
        WHERE id = $1
      `,
        [attempt.id],
      );

      // increment rejection count
      await client.query(
        `
        UPDATE store_orders
        SET rejection_count = rejection_count + 1
        WHERE id = $1
      `,
        [attempt.order_id],
      );

      // 🔁 assign next store
      await assignNextStore(client, attempt.order_id);

      // 📝 log event
      await logOrderEvent(client, {
        orderId: attempt.order_id,
        eventType: ORDER_EVENTS.REJECTED,
        storeId: attempt.store_id,
        message: "Auto rejected (timeout exceeded)",
      });

      await client.query("COMMIT");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
