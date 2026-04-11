// /app/api/orders/[orderId]/action/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import {
  assignNextStore,
  logOrderEvent,
  ORDER_EVENTS,
} from "@/lib/order-routing";
import { AppError } from "@/lib/errors";

export async function POST(req: NextRequest, { params }: any) {
  const client = await pool.connect();

  try {
    const { action, storeId } = await req.json();
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

    if (action === "force_assign") {
      await client.query(
        `
        UPDATE store_orders
        SET current_store_id = $1
        WHERE id = $2
      `,
        [storeId, orderId],
      );

      await logOrderEvent(client, {
        orderId,
        // eventType: "admin_force_assign",
        eventType: ORDER_EVENTS.ADMIN_FORCE_ASSIGN,
        storeId,
        message: "Admin force assigned store",
      });
    }

    if (action === "cancel") {
      await client.query(
        `
        UPDATE store_orders
        SET order_status = 'cancelled'
        WHERE id = $1
      `,
        [orderId],
      );

      await logOrderEvent(client, {
        orderId,
        // eventType: "cancelled",
        eventType: ORDER_EVENTS.CANCELLED,
        message: "Order cancelled by admin",
      });
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");

    if (err instanceof AppError) {
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
        },
        { status: err.statusCode },
      );
    }

    console.error(err);
    return NextResponse.json(
      {
        error: "Something went wrong",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
    // return NextResponse.json({ error: "Failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
