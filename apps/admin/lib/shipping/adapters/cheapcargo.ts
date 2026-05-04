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

  private getAuthenticationToken() {
    const now = new Date();

    // ⏱ Round hour to nearest 2-hour block
    const hour = now.getHours();
    const roundedHour = Math.floor(hour / 2) * 2;

    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const HH = String(roundedHour).padStart(2, "0");

    const timestamp = `${YYYY}${MM}${DD}${HH}`;

    return md5(this.creds.apiKey + timestamp);
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
          password: "34dbe7e451f2d0b166a292ce0021599d",//this.getPasswordHash(),
        },
        shipment: [
          {
            "@orderBy": "price",
            sender: {
              zipcode: input.from.zipcode,
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
    const payload = {
      shipments: {
        authentication: this.getAuthenticationToken(),
        version: "2.1",
        user: {
          email: this.creds.email,
          password: this.getPasswordHash(),
        },
        shipment: [
          {
            "@pay": false,
            "@waitForLabel": true,
            "@id": input.orderId,
            "@orderBy": "price",

            sender: {
              companyName: "Warehouse",
              contactPerson: "Admin",
              street: input.from.street || "Warehouse Street",
              number: input.from.number || "1",
              zipcode: input.from.zipcode,
              city: input.from.city,
              country: input.from.country || "NL",
              phone: "",
              email: this.creds.email,
              type: "business",
            },

            receiver: {
              companyName: input.to.companyName || "Customer",
              contactPerson: input.to.contactPerson || "Customer",
              street: input.to.street || "",
              number: input.to.number || "",
              zipcode: input.to.postal_code,
              city: input.to.city,
              country: input.to.country || "NL",
              phone: input.to.phone || "",
              email: input.to.email || "",
              type: "business",
            },

            content: {
              colli: [
                {
                  description: "Order Package",
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

            reference: input.orderId,
          },
        ],
      },
    };

    const res = await fetch(`${BASE_URL}/createShipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    const shipment = data?.shipments?.shipment?.[0];

    if (!shipment) {
      throw new Error("Invalid CheapCargo response");
    }

    return {
      externalId: shipment.orderNumber,
      trackingNumber: shipment.trackingNumber || null,
      labelUrl: undefined,
      raw: data,
    };
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
        version: "1.6",
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

  /* async getRates(input: ShipmentInput): Promise<any> {
    throw new Error("Use rateRequest flow (not implemented yet)");
  }

  async createShipment(input: ShipmentInput): Promise<ShipmentResult> {
    throw new Error("CheapCargo shipment not implemented");
  }

  async generateLabel(externalId: string): Promise<LabelResult> {
    throw new Error("CheapCargo label not supported");
  } */
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
