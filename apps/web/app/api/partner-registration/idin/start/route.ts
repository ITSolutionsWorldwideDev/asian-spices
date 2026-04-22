// apps/web/app/api/partner-registration/idin/start/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { bank } = await req.json();

  // console.log("bank === ", bank);
  // console.log("ADYEN_API_KEY :", process.env.ADYEN_API_KEY);
  // console.log("ADYEN_MERCHANT :", process.env.ADYEN_MERCHANT);
  // console.log("NEXT_PUBLIC_SITE_URL :", process.env.NEXT_PUBLIC_SITE_URL);

  try {
    // ⚠️ This depends on your provider (Adyen example structure)

    /* const response = await fetch(
      "https://checkout-test.adyen.com/v70/payments",
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.ADYEN_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: {
            currency: "EUR",
            value: 1, // iDIN = verification only
          },
          paymentMethod: {
            type: "idin",
            issuer: bank, // selected bank
          },
          reference: "partner-verification",
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/partner-registration/idin/callback`,
          merchantAccount: process.env.ADYEN_MERCHANT!,
        }),
      },
    ); */

    const response = await fetch(
      "https://checkout-test.adyen.com/v70/payments",
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.ADYEN_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: { currency: "EUR", value: 100 },
          reference: "test-payment",
          merchantAccount: "ITSolutionsHubECOM",
          paymentMethod: { type: "scheme" },
        }),
      },
    );

    const data = await response.json();
    // console.log("status:", response.status);
    // console.log("headers:", response.headers);
    // console.log("data:", data);

    return NextResponse.json({
      redirectUrl: data.action?.url, // 🔥 redirect here
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
