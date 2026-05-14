// apps/web/app/api/paypal/capture/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;

// Get PayPal access token
async function getAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  try {
    const { paypalOrderId, orderId } = await req.json();

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if order already paid (idempotency protection)
    const existing = await pool.query(
      `SELECT payment_status FROM store_orders WHERE id = $1`,
      [orderId]
    );

    if (!existing.rows.length) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (existing.rows[0].payment_status === "paid") {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    // 2️⃣ Get PayPal token
    const accessToken = await getAccessToken();

    // 3️⃣ Capture payment
    const captureRes = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      console.error("PayPal capture error:", captureData);

      return NextResponse.json(
        { success: false, error: captureData },
        { status: 400 }
      );
    }

    // 4️⃣ Extract capture info safely
    const captureId =
      captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    const status = captureData?.status;

    // 5️⃣ Update DB only if CAPTURE COMPLETED
    if (status === "COMPLETED") {
      await pool.query(
        `
        UPDATE store_orders
        SET payment_status = 'paid',
            order_status = 'completed',
            transaction_id = $1,
            updated_at = NOW()
        WHERE id = $2 AND payment_method = 'paypal'
        `,
        [paypalOrderId, orderId]
      );
    }

    return NextResponse.json({
      success: true,
      status,
      captureId,
    });
  } catch (err) {
    console.error("PayPal capture API error:", err);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}