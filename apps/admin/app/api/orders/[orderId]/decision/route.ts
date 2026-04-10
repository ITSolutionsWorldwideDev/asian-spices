// /app/api/orders/[orderId]/decision/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import {
  assignNextStore,
  logOrderEvent,
  ORDER_EVENTS,
} from "@/lib/order-routing";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const client = await pool.connect();

  try {
    const { action } = await req.json();
    const { orderId } = await params;

    await client.query("BEGIN");

    if (action === "reassign") {
      await assignNextStore(client, orderId);

      await logOrderEvent(client, {
        orderId,
        // eventType: "admin_reassign",
        eventType: ORDER_EVENTS.ADMIN_REASSIGN,
        message: "Admin triggered reassign",
      });
    }

    if (action === "force_default") {
      await client.query(
        `UPDATE store_orders
         SET current_store_id = 'YOUR_DEFAULT_STORE_ID'
         WHERE id = $1`,
        [orderId],
      );

      await logOrderEvent(client, {
        orderId,
        // eventType: "admin_reassign",
        eventType: ORDER_EVENTS.ADMIN_REASSIGN,
        message: "Admin triggered reassign",
      });
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  } finally {
    client.release();
  }
}

/* export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { action } = await req.json();

    const { orderId } = await params;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const status = action === "approve" ? "accepted" : "rejected";

    await pool.query(
      `UPDATE store_orders
       SET order_status = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [status, orderId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
} */
