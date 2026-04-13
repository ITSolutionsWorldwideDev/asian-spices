// apps/web/app/api/paynl/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

/**
 * Webhook endpoint for Pay.nl to notify payment status
 */
export async function POST(req: NextRequest) {
  try {
    // Security: verify signature first
    /* const signature = req.headers.get("x-paynl-signature");
    if (!signature || signature !== process.env.PAYNL_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    } */

    // const body = await req.json();

    /**
     * Example payload from Pay.nl (simplified)
     * {
     *   orderId: "uuid-of-your-order",
     *   transactionId: "paynl-transaction-id",
     *   status: "paid" | "pending" | "failed"
     * }
     */
    // const { orderId, transactionId, status } = body;
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const transactionId = params.get("txid");
    const statusCode = params.get("status");
    const orderId = params.get("reference");

    if (!orderId || !transactionId || !statusCode) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    // Map Pay.nl status to your DB enum/field
    let paymentStatus: "pending" | "paid" | "failed" = "pending";

    if (statusCode === "100") paymentStatus = "paid";
    else if (statusCode === "-90") paymentStatus = "failed";

    // if (statusCode === "paid") paymentStatus = "paid";
    // else if (statusCode === "failed") paymentStatus = "failed";

    // Update store_orders table
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        UPDATE store_orders
        SET payment_status = $1,
            transaction_id = $2,
            updated_at = NOW()
        WHERE id = $3
        RETURNING id, order_status, payment_status
        `,
        [paymentStatus, transactionId, orderId],
      );

      if (!result.rows.length) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 },
        );
      }

      console.log(`Order ${orderId} updated: ${paymentStatus}`);

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

