// apps/web/app/api/paypal/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

// PayPal Webhook verification endpoint
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const PAYPAL_API =
  process.env.PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";


// const PAYPAL_API = process.env.NODE_ENV === "production"
//   ? "https://api-m.paypal.com"
//   : "https://api-m.sandbox.paypal.com";

// Verify PayPal webhook signature
async function verifyPayPalWebhook(req: NextRequest, body: any) {
  const transmissionId = req.headers.get("paypal-transmission-id");
  const timestamp = req.headers.get("paypal-transmission-time");
  const webhookId = process.env.PAYPAL_WEBHOOK_ID; // Set your webhook ID in env
  const signature = req.headers.get("paypal-transmission-sig");
  const certUrl = req.headers.get("paypal-cert-url");
  const authAlgo = req.headers.get("paypal-auth-algo");

  const accessTokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const accessToken = (await accessTokenRes.json()).access_token;

  const verifyRes = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: signature,
      transmission_time: timestamp,
      webhook_id: webhookId,
      webhook_event: body,
    }),
  });

  const verifyData = await verifyRes.json();
  return verifyData.verification_status === "SUCCESS";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1️⃣ Verify webhook
    const isValid = await verifyPayPalWebhook(req, body);
    if (!isValid) {
      console.warn("Invalid PayPal webhook signature", body);
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // 2️⃣ Only handle completed payments
    if (body.event_type === "CHECKOUT.ORDER.APPROVED" || body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = body.resource.id; // PayPal Order ID (stored as transaction_id)

      // 3️⃣ Update order in DB
      await pool.query(
        `UPDATE store_orders
         SET payment_status = 'paid', order_status = 'completed', updated_at = NOW()
         WHERE transaction_id = $1 AND payment_method = 'paypal'`,
        [orderId]
      );

      console.log(`Order ${orderId} marked as paid/completed`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}