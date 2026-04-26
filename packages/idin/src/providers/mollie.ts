// packages/idin/src/providers/mollie.ts

import mollieClient from "@mollie/api-client";
import {
  IDINStartInput,
  IDINStartResponse,
  IDINVerifyResponse,
} from "../types";

const mollie = mollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

/**
 * Start iDIN session (Mollie)
 */

export async function startMollieIDIN(
  input: IDINStartInput,
): Promise<IDINStartResponse> {
  //   console.log("startMollieIDIN === ", input);
  //   console.log("mollie client === ", mollie);

  //   console.log(
  //     "webhookUrl === ",
  //     `${process.env.NEXT_PUBLIC_SITE_URL}/api/partner-registration/idin/webhook`,
  //   );

  const payment = (await mollie.payments.create({
    amount: {
      currency: "EUR",
      value: "0.01",
    },
    description: `iDIN verification for tenant ${input.tenantId}`,
    method: "ideal" as any,
    issuer: input.issuer,
    redirectUrl: input.returnUrl,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/partner-registration/idin/webhook`,
    metadata: {
      tenantId: input.tenantId,
      type: "idin",
      ref: input.tenantId, // or merchantReference
    },
  })) as any;
  //   console.log("payment === ", payment);

  return {
    redirectUrl: payment._links?.checkout?.href,
    transactionId: payment.id,
  };
}

/**
 * Verify iDIN session
 */
export async function verifyMollieIDIN(
  transactionId: string,
): Promise<IDINVerifyResponse> {
  const payment = (await mollie.payments.get(transactionId)) as any;

  if (payment.status === "paid") {
    const details: any = payment.details;

    return {
      status: "success",
      data: {
        first_name: details?.consumerName ?? null,
        iban: details?.consumerAccount ?? null,
        country: details?.consumerCountry ?? "NL",
      },
    };
  }

  if (["failed", "canceled", "expired"].includes(payment.status)) {
    return { status: "failed" };
  }

  return { status: "pending" };
}

/* export async function startMollieIDIN(
  input: IDINStartInput,
): Promise<IDINStartResponse> {
   const payment = await mollie.payments.create({
    amount: {
      currency: "EUR",
      value: "0.01" // Mollie workaround (iDIN often piggybacks payment)
    },
    method: PaymentMethod.ideal, // ⚠️ Mollie may require workaround if iDIN not enabled
    issuer: input.issuer,
    redirectUrl: input.returnUrl,
    metadata: {
      tenantId: input.tenantId,
      type: "idin",
    },
  });

  return {
    redirectUrl: payment._links.checkout.href, // ✅ correct way
    transactionId: payment.id,
  };
} */
