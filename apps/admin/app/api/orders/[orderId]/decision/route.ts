// /app/api/orders/[orderId]/decision/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function POST(
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
}