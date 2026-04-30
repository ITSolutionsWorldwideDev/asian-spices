// apps/web/app/api/paynl/confirm/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function POST(req: NextRequest) {
  try {
    const { orderId, statusAction, transactionId } = await req.json();

    if (!orderId || !statusAction) {
      return NextResponse.json(
        { success: false, error: "Missing data" },
        { status: 400 },
      );
    }

    const action = statusAction.toLowerCase();

    let paymentStatus: "pending" | "paid" | "failed" = "pending";

    if (action === "paid") paymentStatus = "paid";
    else if (["failed", "cancelled", "expired"].includes(action)) {
      paymentStatus = "failed";
    }

    const result: any = await pool.query(
      `
      UPDATE store_orders
      SET payment_status = $1,
          transaction_id = COALESCE($2, transaction_id),
          updated_at = NOW()
      WHERE id = $3
        AND payment_status != 'paid'
      RETURNING payment_status
      `,
      [paymentStatus, transactionId, orderId],
    );

    return NextResponse.json({
      success: true,
      updated: result?.rowCount > 0,
    });
  } catch (err) {
    console.error("Confirm error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
