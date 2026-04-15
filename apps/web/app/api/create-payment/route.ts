// apps/web/app/api/create-payment/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

// Pay.nl config
const PAYNL_SERVICE_ID = process.env.PAYNL_SERVICE_ID;
const PAYNL_API_TOKEN = process.env.PAYNL_API_TOKEN;
// const PAYNL_API_URL = "https://api.pay.nl/v1/payment";
// const PAYNL_API_URL = "https://rest-api.pay.nl/v1/Transaction/start";

// PayPal config
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, customerEmail, paymentMethod } = await req.json();

    if (!orderId || !amount || !customerEmail || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch order from DB
    const orderRes = await pool.query(
      `SELECT * FROM store_orders WHERE id = $1`,
      [orderId],
    );
    if (!orderRes.rows.length)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const order = orderRes.rows[0];

    if (paymentMethod === "paynl") {
      // 1. CREATE ORDER
      const orderResponse = await fetch("https://connect.pay.nl/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYNL_API_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          serviceId: PAYNL_SERVICE_ID,
          amount: {
            // value: amount.toFixed(2),
            value: Math.round(amount * 100), // ✅ integer in cents
            currency: "EUR",
          },
          description: `Order ${order.order_number}`,
          reference: order.id.toString(),
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`,
          exchangeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
          // webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
          customer: {
            email: customerEmail,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error("Pay.nl error:", orderData);
        throw new Error("Pay.nl request failed");
      }

      const paynlOrderId = orderData.id;

      // 2. CREATE PAYMENT
      const paymentResponse = await fetch(
        `https://connect.pay.nl/v1/orders/${paynlOrderId}/payments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYNL_API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            paymentMethod: {
              id: 10, // ✅ choose method
            },
            returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`,
            exchangeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
            // webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
          }),
        },
      );

      const paymentData = await paymentResponse.json();

      // console.log("Pay.nl order response:", orderData);
      // console.log("Pay.nl payment response:", paymentData);
      // console.log(JSON.stringify(paymentData, null, 2));

      if (!paymentResponse.ok) {
        console.error("Pay.nl payment error:", paymentData);
        return NextResponse.json(
          { error: "Pay.nl payment creation failed", details: paymentData },
          { status: 500 },
        );
      }

      const redirectUrl =
        paymentData?.links?.checkout ||
        paymentData?.links?.redirect ||
        paymentData?.checkoutUrl ||
        paymentData?.redirectUrl;

      if (!redirectUrl) {
        console.error("Missing redirect URL:", paymentData);
        throw new Error("No redirect URL from Pay.nl");
      }

      // const transactionId = data.id;
      // const redirectUrl = data.links?.approve?.href;

      // Save transactionId
      await pool.query(
        `UPDATE store_orders SET transaction_id = $1, payment_method = $2 WHERE id = $3`,
        [paynlOrderId, "paynl", order.id],
        // [data.transactionId, "paynl", order.id]
      );

      return NextResponse.json({
        success: true,
        redirectUrl: redirectUrl,
        transactionId: paynlOrderId,
      });
    }

    if (paymentMethod === "paypal") {
      const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel?orderId=${order.id}`;

      const { approveLink, orderData } = await createPayPalOrder(
        order.order_number,
        amount,
        returnUrl,
        cancelUrl,
      );

      // Save PayPal order ID as transaction_id
      await pool.query(
        `UPDATE store_orders SET transaction_id = $1, payment_method = $2 WHERE id = $3`,
        [orderData.id, "paypal", order.id],
      );

      return NextResponse.json({
        success: true,
        redirectUrl: approveLink,
        transactionId: orderData.id,
      });
    }

    return NextResponse.json(
      { error: "Unsupported payment method" },
      { status: 400 },
    );
  } catch (err) {
    console.error("Create payment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function createPayPalOrder(
  orderNumber: string,
  amount: number,
  returnUrl: string,
  cancelUrl: string,
) {
  // 1. Get access token
  const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
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
  const approveLink = orderData.links.find(
    (link: any) => link.rel === "approve",
  )?.href;

  return { orderData, approveLink };
}

// Prepare Pay.nl payload
/* const paymentPayload = {
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
      */
/* 
      const params = new URLSearchParams();

      params.append("serviceId", PAYNL_SERVICE_ID!);
      params.append("amount", Math.round(amount * 100).toString());
      params.append("currency", "EUR");
      // params.append("paymentOptionId", "1"); // card
      // params.append("paymentOptionId", paymentOptionIdFromUI);
      params.append("description", `Order ${order.order_number}`);
      params.append("reference", order.id.toString());
      // params.append(
      //   "returnUrl",
      //   `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`,
      // );
      params.append(
        "exchangeUrl",
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/paynl/webhook`,
      );
      params.append("customer.email", customerEmail);

      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "127.0.0.1";

      params.append("ipAddress", ip);
      params.append(
        "finishUrl",
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${order.id}`,
      );

      const response = await fetch(
        "https://rest-api.pay.nl/v1/Transaction/start",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYNL_API_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      ); */

/* const status = response.status;
      const text = await response.text();

      let responsedata;
      try {
        responsedata = JSON.parse(text);
      } catch {
        responsedata = null;
      }

      if (!response.ok) {
        console.error("Pay.nl error response:", {
          status: response.status,
          text,
        });

        throw new Error(`Pay.nl HTTP error (${response.status}): ${text}`);
      }

      if (responsedata?.status !== "success") {
        throw new Error(`Pay.nl API error: ${text}`);
      }

      console.log("Webhook from:", req.headers.get("x-forwarded-for"));

      console.log("Pay.nl response:", responsedata); */

// if (data.status !== "success") {
//   return NextResponse.json(
//     { error: "Pay.nl failed", details: data },
//     { status: 500 },
//   );
// }
// if (!data.success)
//   return NextResponse.json(
//     { error: "Pay.nl failed", details: data },
//     { status: 500 },
//   );

// const transactionId = responsedata.transaction.transactionId;
// const redirectUrl = responsedata.transaction.paymentURL;
