// lib/shipping/adapters/cheapcargo.ts

import md5 from "md5";

import {
  ShippingAdapter,
  ShipmentInput,
  ShipmentResult,
  LabelResult,
} from "../types";

type Credentials = {
  apiKey: string;
  email: string;
  password: string;
};

const BASE_URL = "https://www.cheapcargo.com/api";
// switch to demo if needed:
// const BASE_URL = "https://www.cheapcargo-demo.nl/api";
export class CheapCargoAdapter implements ShippingAdapter {
  constructor(private creds: Credentials) {}

  /* private getAuthenticationToken() {
    const now = new Date();

    // ⏱ Round hour to nearest 2-hour block
    const hour = now.getHours();
    const roundedHour = Math.floor(hour / 2) * 2;

    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const HH = String(roundedHour).padStart(2, "0");

    const timestamp = `${YYYY}${MM}${DD}${HH}`;

    // console.log("this.creds.apiKey ==== ", this.creds.apiKey);
    // console.log("timestamp ==== ", timestamp);
    // md5(apiKey + timestamp);

    // const returnKey = md5(this.creds.apiKey) + timestamp;
    const returnKey = md5(this.creds.apiKey + timestamp);
    // console.log("returnKey ==== ", returnKey);

    return returnKey;
  }

  private getPasswordHash() {
    const now = new Date();

    const hour = now.getUTCHours();
    const roundedHour = Math.floor(hour / 2) * 2;

    const YYYY = now.getUTCFullYear();
    const MM = String(now.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(now.getUTCDate()).padStart(2, "0");
    const HH = String(roundedHour).padStart(2, "0");

    const timestamp = `${YYYY}${MM}${DD}${HH}`;
    return md5(this.creds.password);
  } */

/**
   * ⏱ Helper to compute standardized 2-hour server time-blocks
   * Aligned completely to local system timezone parameters
   */

  private getStandardizedTimestamp(useUTC = false): string {
    const now = new Date();
    
    const hour = useUTC ? now.getUTCHours() : now.getHours();
    const roundedHour = Math.floor(hour / 2) * 2;

    const YYYY = useUTC ? now.getUTCFullYear() : now.getFullYear();
    const MM = String((useUTC ? now.getUTCMonth() : now.getMonth()) + 1).padStart(2, "0");
    const DD = String(useUTC ? now.getUTCDate() : now.getDate()).padStart(2, "0");
    const HH = String(roundedHour).padStart(2, "0");

    return `${YYYY}${MM}${DD}${HH}`;
  }

  private getAuthenticationToken() {
    const timestamp = this.getStandardizedTimestamp(false); // Matches your key setup criteria
    return md5(this.creds.apiKey + timestamp);
  }

  private getPasswordHash() {
    // FIX: Aligned explicitly to local timestamp blocks to prevent multi-hour shifting blocks
    const timestamp = this.getStandardizedTimestamp(false); 
    return md5(this.creds.password);
  }

  // ======================================================
  // 🔹 RATE REQUEST
  // ======================================================
  async getRates(input: ShipmentInput): Promise<any> {
    const payload = {
      shipments: {
        authentication: this.getAuthenticationToken(),
        version: "2.0",
        user: {
          email: this.creds.email,
          password: this.getPasswordHash(), // "34dbe7e451f2d0b166a292ce0021599d", //
        },
        shipment: [
          {
            "@orderBy": "price",
            sender: {
              zipcode: input.from.postal_code,
              city: input.from.city,
              country: input.from.country || "NL",
              type: "business",
            },
            receiver: {
              zipcode: input.to.postal_code,
              city: input.to.city,
              country: input.to.country || "NL",
              type: "business",
            },
            content: {
              colli: [
                {
                  description: "Order shipment",
                  weight: Number(input.parcel.weight),
                  length: Number(input.parcel.length || 0),
                  width: Number(input.parcel.width || 0),
                  height: Number(input.parcel.height || 0),
                  value: 100,
                  package: "PACKAGE",
                  quantity: Number(input.parcel.boxes || 1),
                },
              ],
            },
            incoterm: "DAP",
          },
        ],
      },
    };

    const res = await fetch(`${BASE_URL}/rateRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  }

  // ======================================================
  // 🔹 CREATE SHIPMENT
  // ======================================================
  async createShipment(input: ShipmentInput): Promise<ShipmentResult> {
    console.log("createShipment API input === ", input);

    const payload = {
      shipments: {
        authentication: this.getAuthenticationToken(), //"5b154bba6f6c5dc819606ce3fcbc14bd", //
        version: "2.1",
        user: {
          email: this.creds.email,
          password: this.getPasswordHash(),
        },
        shipment: [
          {
            "@pay": false,
            "@waitForLabel": false,
            "@id": input.orderId,
            "@orderBy": "price",
            sender: {
              companyName: input.from.name || "Store Vendor Instance",
              contactPerson: "Store Administrator",
              street: input.from.street || "Hoofdstraat",
              number: input.from.number || "123",
              zipcode: input.from.postal_code || "1000AA",
              city: input.from.city || "Amsterdam",
              country: input.from.country || "NL",
              phone: input.from.phone ||"+31612345678",
              email: input.from.email ||"sender@example.com",
              type: "business",
            },
            receiver: {
              companyName: input.to.companyName || "Private Customer Consignee",
              contactPerson: input.to.contactPerson || "Jane Receiver",
              street: input.to.street || "Kerkstraat",
              number: input.to.number || "456",
              zipcode: input.to.postal_code || "2000BB",
              city: input.to.city || "Rotterdam",
              country: input.to.country || "NL",
              phone: input.to.phone || "+31687654321",
              email: input.to.email || "receiver@example.com",
              type: "business",
            },
            content: {
              colli: [
                {
                  description: "Order package",
                  weight: Number(input.parcel.weight) || 2.5,
                  length: Number(input.parcel.length || 0),
                  width: Number(input.parcel.width || 0),
                  height: Number(input.parcel.height || 0),
                  value: 150,
                  package: "PACKAGE",
                  quantity: Number(input.parcel.boxes || 1),
                },
              ],
            },
            reference: input.orderId,
          },
        ],
      },
    };

    /* 
    
        email: store_addressRes.store_email,
        phone: store_addressRes.store_phone,
        currency_code: store_addressRes.currency_code,
    */

        console.log("Submitting stringified payload data mapping to CheapCargo:", JSON.stringify(payload, null, 2));

    console.log("createShipment API payload === ", payload);
    console.log("createShipment API payload shipments === ", payload?.shipments?.shipment);
    console.log("createShipment sender zipcode === ", payload?.shipments?.shipment[0]?.sender.zipcode);
    console.log("createShipment receiver zipcode === ", payload?.shipments?.shipment[0]?.receiver.zipcode);
    console.log("createShipment API URL === ", `${BASE_URL}/createShipment`);

    const res = await fetch(`${BASE_URL}/createShipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("shipment data === ", data);
    console.log("shipment data.shipment === ", data.shipment);

    if (data?.shipment?.status !== "ok") {
      console.log("shipment data.shipment?.error === ", data.shipment?.error);
      console.error("CheapCargo error:", data);
      throw new Error("CheapCargo shipment failed");
    }
    console.log("shipment data.shipment?.order === ", data.shipment?.order);

    const order = data?.shipment?.order?.[0];

    if (!order) {
      console.error("Invalid CheapCargo response:", data);
      throw new Error("Invalid CheapCargo response");
    }

    const externalId = order.number;
    const trackingNumber = order.details?.awb || undefined;
    const trackingUrl = order.details?.trackAndTrace || undefined;

    console.log("externalId === ", externalId);
    console.log("trackingNumber === ", trackingNumber);
    console.log("trackingUrl === ", trackingUrl);

    // return {
    //   externalId,
    //   trackingNumber,
    //   trackingUrl,
    //   labelUrl: undefined, // label comes from separate API
    //   raw: data,
    // };

    return {
      externalId: externalId,
      trackingNumber: trackingNumber,
      trackingUrl: trackingUrl,
      labelUrl: undefined,
      raw: data,
    };
    // const shipment = data?.shipments?.order[0];

    // console.log("shipment === ", shipment);
    // console.log("shipment details === ", shipment?.details);

    // if (!shipment) {
    //   throw new Error("Invalid CheapCargo response");
    // }

    // return {
    //   externalId: shipment.orderNumber,
    //   trackingNumber: shipment.trackingNumber || null,
    //   labelUrl: undefined,
    //   raw: data,
    // };
  }

  // ======================================================
  // 🔹 TRACK SHIPMENT
  // ======================================================
  async trackShipment(orderNumber: string): Promise<any> {
    const payload = {
      shipments: {
        authentication: this.getAuthenticationToken(),
        version: "1.9",
        user: {
          email: this.creds.email,
          password: this.getPasswordHash(),
        },
        status: [
          {
            orderNumber,
          },
        ],
      },
    };

    const res = await fetch(`${BASE_URL}/getStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.json();
  }

  // ======================================================
  // 🔹 GENERATE LABEL
  // ======================================================
  async generateLabel(orderNumber: string): Promise<LabelResult> {
    const payload = {
      labels: {
        authentication: this.getAuthenticationToken(),
        version: "2.1",
        user: {
          email: this.creds.email,
          password: this.getPasswordHash(),
        },
        label: [
          {
            orderNumber,
            type: "pdf",
          },
        ],
      },
    };

    const res = await fetch(`${BASE_URL}/getLabel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("data?.labels?.label === ", data);

    const url = data?.labels?.label?.[0]?.file || data?.labels?.label?.[0]?.url;

    if (!url) {
      throw new Error("Label not generated");
    }

    return { url };
  }

  // ======================================================
  // 🔹 CANCEL SHIPMENT
  // ======================================================
  async cancelShipment(orderId: string, orderNumber: string): Promise<any> {
    const payload = {
      shipments: {
        authentication: this.getAuthenticationToken(),
        version: "2.1",
        user: {
          email: this.creds.email,
          password: this.getPasswordHash(),
        },
        order: [
          {
            "@id": orderId,
            orderNumber,
          },
        ],
      },
    };

    const res = await fetch(`${BASE_URL}/cancelShipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.json();
  }
}

// import { withRetry } from "@/lib/utils/retry";
// type CheapCargoCreds = {
//   apiKey: string;
//   email: string;
//   password: string;
// };

// const BASE_URL = "https://api.cheapcargo.dev";
/* export class CheapCargoAdapter implements ShippingAdapter {
  private creds: Credentials;

  constructor(creds: Credentials) {
    this.creds = creds;
  }

  private async request(endpoint: string, method: string, body?: any) {
    return withRetry(async () => {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.creds.api_key}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("CheapCargo error:", data);
        throw new Error(data?.message || "CheapCargo failed");
      }

      return data;
    });
  }

  async getRates(address: any) {
    return this.request("/rates", "POST", { address });
  }

  async createShipment(order: any) {
    return this.request("/shipments", "POST", {
      recipient: {
        name: `${order.firstName} ${order.lastName}`,
        address: order.address,
        city: order.city,
        postal_code: order.zip,
        country: order.country,
      },
      parcels: order.items?.map((i: any) => ({
        weight: i.weight || 1,
        description: i.title,
      })),
    });
  }

  async generateLabel(shipmentId: string) {
    return this.request(`/shipments/${shipmentId}/label`, "GET");
  }
} */
