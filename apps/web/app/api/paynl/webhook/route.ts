// apps/web/app/api/paynl/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

/**
 * Webhook endpoint for Pay.nl to notify payment status
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // console.log("Webhook payload:", body);

    const transactionId = body.id;
    // const status = body.status?.toLowerCase();
    const status = body.status?.action?.toLowerCase();
    const reference = body.reference;

    if (!reference) {
      console.error("Missing reference in webhook:", body);
      return NextResponse.json(
        { success: false, error: "Missing order reference" },
        { status: 400 },
      );
    }

    // 🔐 OPTIONAL SAFETY: verify using statusUrl if available
    const statusUrl = body?.links?.status;

    let verifiedStatus = body?.status?.action?.toLowerCase();

    if (statusUrl) {
      const verifyRes = await fetch(statusUrl, {
        headers: {
          Authorization: `Bearer ${process.env.PAYNL_API_TOKEN}`,
          Accept: "application/json",
        },
      });

      const verifyData = await verifyRes.json();
      verifiedStatus = verifyData?.status?.action?.toLowerCase();
    }

    // =========================
    // STATUS MAPPING
    // =========================
    let paymentStatus: "pending" | "paid" | "failed" = "pending";

    if (verifiedStatus === "paid") {
      paymentStatus = "paid";
    } else if (["failed", "cancelled", "expired"].includes(verifiedStatus)) {
      paymentStatus = "failed";
    }

    // if (status === "paid") paymentStatus = "paid";
    // else if (["failed", "cancelled", "expired"].includes(status))
    //   paymentStatus = "failed";
    // else paymentStatus = "pending";

    // =========================
    // IDEMPOTENT UPDATE
    // =========================
    await pool.query(
      `
      UPDATE store_orders
      SET payment_status = $1,
          transaction_id = COALESCE($2, transaction_id),
          updated_at = NOW()
      WHERE id = $3
        AND payment_status != 'paid'
      `,
      [paymentStatus, transactionId, reference],
    );

    // console.log(`Order ${reference} → ${paymentStatus}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

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
/* const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const transactionId = params.get("txid");
    const statusCode = params.get("status");
    const orderId = params.get("reference");

    if (!orderId || !transactionId || !statusCode) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    } */
