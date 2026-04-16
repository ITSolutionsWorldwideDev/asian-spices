import { withRetry } from "@/lib/utils/retry";

const BASE_URL = "https://api.cheapcargo.dev"; // adjust if needed

type Credentials = {
  api_key: string;
  api_secret: string;
};

async function request(
  endpoint: string,
  method: string,
  body: any,
  creds: Credentials,
) {
  return withRetry(async () => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creds.api_key}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("CheapCargo API error:", data);
      throw new Error(data?.message || "CheapCargo request failed");
    }

    return data;
  });
}

/**
 * 1. Get shipping rates
 */
export async function getRates(address: any, creds: Credentials) {
  return request("/rates", "POST", { address }, creds);
}

/**
 * 2. Create shipment
 */
export async function createShipment(order: any, creds: Credentials) {
  return request(
    "/shipments",
    "POST",
    {
      recipient: {
        name: `${order.firstName} ${order.lastName}`,
        address: order.address,
        city: order.city,
        postal_code: order.zip,
        country: order.country,
      },
      parcels: order.items.map((i: any) => ({
        weight: 1, // TODO dynamic
        description: i.title,
      })),
    },
    creds,
  );
}

/**
 * 3. Generate label
 */
export async function generateLabel(shipmentId: string, creds: Credentials) {
  return request(`/shipments/${shipmentId}/label`, "GET", null, creds);
}

export async function testCheapCargoConnection(
  apiKey: string,
  apiSecret: string
) {
  try {
    const res = await fetch("https://cheapcargo.dev/api/test-auth", {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "x-api-secret": apiSecret,
      },
    });

    if (!res.ok) {
      const text = await res.text();

      return {
        success: false,
        error: "Invalid API credentials",
        details: text,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: "Unable to reach provider API",
    };
  }
}