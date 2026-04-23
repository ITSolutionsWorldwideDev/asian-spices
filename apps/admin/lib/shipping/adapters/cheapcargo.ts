// lib/shipping/adapters/cheapcargo.ts

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
export class CheapCargoAdapter implements ShippingAdapter {
  constructor(private creds: Credentials) {}

  async getRates(input: ShipmentInput): Promise<any> {
    throw new Error("Use rateRequest flow (not implemented yet)");
  }

  async createShipment(input: ShipmentInput): Promise<ShipmentResult> {
    throw new Error("CheapCargo shipment not implemented");
  }

  async generateLabel(externalId: string): Promise<LabelResult> {
    throw new Error("CheapCargo label not supported");
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
