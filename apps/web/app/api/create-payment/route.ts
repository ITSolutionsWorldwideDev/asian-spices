// apps/web/app/api/create-payment/route.ts

import { NextRequest, NextResponse } from "next/server";
// import Paynl from '@/lib/paynl';
// import { CreatePaymentRequest, CreatePaymentResponse } from '@/types/payment';

import { pool } from "@acme/db";

// Pay.nl config
const PAYNL_SERVICE_ID = process.env.PAYNL_SERVICE_ID;
const PAYNL_API_TOKEN = process.env.PAYNL_API_TOKEN;
const PAYNL_API_URL = "https://api.pay.nl/v1/payment";

// PayPal config
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function createPayPalOrder(orderNumber: string, amount: number, returnUrl: string, cancelUrl: string) {
  // 1. Get access token
  const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. Create order
  const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderNumber,
          amount: {
            currency_code: "EUR",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  });

  const orderData = await orderRes.json();
  const approveLink = orderData.links.find((link: any) => link.rel === "approve")?.href;

  return { orderData, approveLink };
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerEmail, paymentMethod } = await req.json();

    if (!orderId || !amount || !customerEmail || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch order from DB
    const orderRes = await pool.query(`SELECT * FROM store_orders WHERE id = $1`, [orderId]);
    if (!orderRes.rows.length) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = orderRes.rows[0];

    if (paymentMethod === "paynl") {
      // Prepare Pay.nl payload
      const paymentPayload = {
        serviceId: PAYNL_SERVICE_ID,
        apiToken: PAYNL_API_TOKEN,
        amount: Math.round(amount * 100), // cents
        paymentOptionId: 1, // card
        description: `Order ${order.order_number}`,
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`,
        exchangeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
        customer: { email: customerEmail },
      };

      const response = await fetch(PAYNL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      const data = await response.json();
      if (!data.success) return NextResponse.json({ error: "Pay.nl failed", details: data }, { status: 500 });

      // Save transactionId
      await pool.query(
        `UPDATE store_orders SET transaction_id = $1, payment_method = $2 WHERE id = $3`,
        [data.transactionId, "paynl", order.id]
      );

      return NextResponse.json({ success: true, redirectUrl: data.redirectUrl, transactionId: data.transactionId });
    }

    if (paymentMethod === "paypal") {
      const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel?orderId=${order.id}`;

      const { approveLink, orderData } = await createPayPalOrder(order.order_number, amount, returnUrl, cancelUrl);

      // Save PayPal order ID as transaction_id
      await pool.query(
        `UPDATE store_orders SET transaction_id = $1, payment_method = $2 WHERE id = $3`,
        [orderData.id, "paypal", order.id]
      );

      return NextResponse.json({ success: true, redirectUrl: approveLink, transactionId: orderData.id });
    }

    return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
  } catch (err) {
    console.error("Create payment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* // Pay.nl config (set in env)
const PAYNL_SERVICE_ID = process.env.PAYNL_SERVICE_ID;
const PAYNL_API_TOKEN = process.env.PAYNL_API_TOKEN;
const PAYNL_API_URL = "https://api.pay.nl/v1/payment";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerEmail, paymentMethod } = await req.json();

    if (!orderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1️⃣ Fetch order from DB
    const orderRes = await pool.query(
      `SELECT * FROM store_orders WHERE id = $1`,
      [orderId],
    );

    if (!orderRes.rows.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderRes.rows[0];

    // 2️⃣ Prepare payment payload
    // Pay.nl expects amounts in cents
    const paymentPayload = {
      serviceId: PAYNL_SERVICE_ID,
      apiToken: PAYNL_API_TOKEN,
      amount: Math.round(amount * 100), // convert to cents
      paymentOptionId: paymentMethod === "paypal" ? 574 : 1, // example IDs
      description: `Order ${order.order_number}`,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`,
      exchangeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
      customer: {
        email: customerEmail,
      },
    };

    // 3️⃣ Call Pay.nl API
    const response = await fetch(PAYNL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Failed to create payment", details: data },
        { status: 500 },
      );
    }

    // 4️⃣ Save transaction ID to order
    await pool.query(
      `UPDATE store_orders SET transaction_id = $1, payment_method = $2 WHERE id = $3`,
      [data.transactionId, paymentMethod, order.id],
    );

    // 5️⃣ Return redirect URL to frontend
    return NextResponse.json({
      success: true,
      redirectUrl: data.redirectUrl,
      transactionId: data.transactionId,
    });
  } catch (err) {
    console.error("Create payment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} */

/* export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentRequest = await req.json();

    const { amount, orderId, customerEmail } = body;

    if (!amount || !orderId || !customerEmail) {
      return NextResponse.json<CreatePaymentResponse>(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const result = await Paynl.Transaction.start({
      amount: Math.round(amount * 100), // cents
      currency: 'EUR',
      description: `Order #${orderId}`,
      returnUrl: `${process.env.BASE_URL}/checkout/success`,
      exchangeUrl: `${process.env.BASE_URL}/api/webhook`,
      email: customerEmail,
    });

    return NextResponse.json<CreatePaymentResponse>({
      redirectUrl: result.paymentURL,
      transactionId: result.transactionId,
    });
  } catch (error) {
    console.error('Payment error:', error);

    return NextResponse.json<CreatePaymentResponse>(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
} */
