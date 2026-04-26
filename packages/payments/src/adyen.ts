// packages/payments/adyen.ts

export async function adyenRequest(endpoint: string, body: any) {

  const res = await fetch(
    `https://checkout-test.adyen.com/v70/${endpoint}`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.ADYEN_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Adyen error:", data);
    throw new Error("Adyen request failed");
  }

  return data;
}