// lib/shipping/providers/cheapcargo.ts

import crypto from "crypto";
import { withRetry } from "@/lib/utils/retry";
import md5 from "md5";

// const BASE_URL = "https://www.cheapcargo-demo.nl/api/rateRequest";
const BASE_URL = "https://www.cheapcargo.com/api/rateRequest";

type Credentials = {
  apiKey: string;
  email: string;
  password: string;
};

// -----------------------------
// Helpers
// -----------------------------


function getAuthenticationToken(apiKey: any) {
  const now = new Date();

  // ⏱ Round hour to nearest 2-hour block
  const hour = now.getHours();
  const roundedHour = Math.floor(hour / 2) * 2;

  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const DD = String(now.getDate()).padStart(2, "0");
  const HH = String(roundedHour).padStart(2, "0");

  const timestamp = `${YYYY}${MM}${DD}${HH}`;

  return md5(apiKey + timestamp);
}

function getPasswordHash(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

/* function getPasswordHash(pwd: any) {

  const now = new Date();

  const hour = now.getUTCHours();
  const roundedHour = Math.floor(hour / 2) * 2;

  const YYYY = now.getUTCFullYear();
  const MM = String(now.getUTCMonth() + 1).padStart(2, "0");
  const DD = String(now.getUTCDate()).padStart(2, "0");
  const HH = String(roundedHour).padStart(2, "0");

  const timestamp = `${YYYY}${MM}${DD}${HH}`;

  return md5(pwd);
} */

// -----------------------------
// TEST CONNECTION (ONLY FUNCTION YOU NEED HERE)
// -----------------------------
export async function testCheapCargoConnection(creds: Credentials) {
  try {
    // const timestamp = generateTimestamp();

    // console.log("creds.apiKey === ", creds.apiKey);
    // // console.log("timestamp === ", timestamp);
    console.log("creds.password === ", creds.password);

    // const authentication = md5(creds.apiKey + timestamp);
    // const passwordHash = md5(creds.password);

    const authentication = getAuthenticationToken(creds.apiKey);
    const passwordHash = "34dbe7e451f2d0b166a292ce0021599d";//getPasswordHash(creds.apiKey);

    console.log("authentication === ", authentication);
    console.log("creds.email === ", creds.email);
    console.log("passwordHash === ", passwordHash);

    const payload = {
      shipments: {
        "authentication": authentication,
        version: "2.1",
        user: {
          email: creds.email,
          password: passwordHash,
        },
        shipment: [
          {
            "@orderBy": "price",
            sender: {
              zipcode: "3011 TA",
              city: "Amsterdam",
              country: "NL",
              type: "business",
            },
            receiver: {
              zipcode: "1511 AN",
              city: "Oostzaan",
              country: "NL",
              type: "business",
            },
            content: {
              colli: [
                {
                  description: "Test package",
                  weight: 1,
                  length: 10,
                  width: 10,
                  height: 10,
                  value: 10,
                  package: "PACKAGE",
                  quantity: 1,
                },
              ],
            },
            incoterm: "DAP",
          },
        ],
      },
    };

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("CheapCargo test:", {
      // timestamp,
      authentication,
      response: data,
    });

    // API error
    if (data?.rates?.status === "error") {
      return {
        success: false,
        error: data?.rates?.error?.[0]?.message || "Authentication failed",
        details: data,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: "Request failed",
        details: data,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: "Unable to reach provider API",
      details: err?.message,
    };
  }
}

/* import { withRetry } from "@/lib/utils/retry";

import crypto from "crypto";

function generateTimestamp() {
  const now = new Date();

  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");

  // 2-hour bucket
  const hourUTC = now.getUTCHours();
  const hh = String(Math.floor(hourUTC / 2) * 2).padStart(2, "0");

  return `${yyyy}${mm}${dd}${hh}`;
}

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

export async function testCheapCargoConnection(
  apiKey: string,
  email: string,
  password: string // plain password
) {
  try {
    // 🔐 Generate auth values
    const timestamp = generateTimestamp();
    const authentication = md5(apiKey + timestamp);
    const passwordHash = md5(password);

    // 🧪 Minimal valid payload (rate request)
    const payload = {
      shipments: {
        authentication,
        version: "2.1",
        user: {
          email,
          password: passwordHash,
        },
        shipment: [
          {
            "@orderBy": "price",
            sender: {
              zipcode: "1000AA",
              city: "Amsterdam",
              country: "NL",
              type: "business",
            },
            receiver: {
              zipcode: "2000BB",
              city: "Rotterdam",
              country: "NL",
              type: "business",
            },
            content: {
              colli: [
                {
                  description: "Test package",
                  weight: 1,
                  length: 10,
                  width: 10,
                  height: 10,
                  value: 10,
                  package: "PACKAGE",
                  quantity: 1,
                },
              ],
            },
            incoterm: "DAP",
          },
        ],
      },
    };

    // 📡 Call REAL endpoint
    const res = await fetch(
      "https://www.cheapcargo.com/api/rateRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    // 🧠 Debug logs (KEEP during development)
    console.log("CheapCargo test debug:", {
      timestamp,
      authentication,
      response: data,
    });

    // ❌ API-level error
    if (data?.rates?.status === "error") {
      return {
        success: false,
        error: data?.rates?.error?.[0]?.message || "Authentication failed",
        details: data,
      };
    }

    // ❌ HTTP-level error
    if (!res.ok) {
      return {
        success: false,
        error: "Request failed",
        details: data,
      };
    }

    // ✅ Success
    return {
      success: true,
    };
  } catch (err: any) {
    console.error("CheapCargo test error:", err);

    return {
      success: false,
      error: "Unable to reach provider API",
      details: err?.message,
    };
  }
}
 */

// const BASE_URL = "https://api.cheapcargo.dev"; // adjust if needed

// type Credentials = {
//   api_key: string;
//   api_secret: string;
// };

// async function request(
//   endpoint: string,
//   method: string,
//   body: any,
//   creds: Credentials,
// ) {
//   return withRetry(async () => {
//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${creds.api_key}`,
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("CheapCargo API error:", data);
//       throw new Error(data?.message || "CheapCargo request failed");
//     }

//     return data;
//   });
// }

/**
 * 1. Get shipping rates
 */
// export async function getRates(address: any, creds: Credentials) {
//   return request("/rates", "POST", { address }, creds);
// }

/**
 * 2. Create shipment
 */
// export async function createShipment(order: any, creds: Credentials) {
//   return request(
//     "/shipments",
//     "POST",
//     {
//       recipient: {
//         name: `${order.firstName} ${order.lastName}`,
//         address: order.address,
//         city: order.city,
//         postal_code: order.zip,
//         country: order.country,
//       },
//       parcels: order.items.map((i: any) => ({
//         weight: 1, // TODO dynamic
//         description: i.title,
//       })),
//     },
//     creds,
//   );
// }

/**
 * 3. Generate label
 */
// export async function generateLabel(shipmentId: string, creds: Credentials) {
//   return request(`/shipments/${shipmentId}/label`, "GET", null, creds);
// }

/* export async function testCheapCargoConnection(
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

    console.log('testCheapCargoConnection res ==== ',res);

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
} */
/* function generateTimestamp() {
  const now = new Date();

  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");

  const hourUTC = now.getUTCHours();
  const hh = String(Math.floor(hourUTC / 2) * 2).padStart(2, "0");

  return `${yyyy}${mm}${dd}${hh}`;
}

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
} */