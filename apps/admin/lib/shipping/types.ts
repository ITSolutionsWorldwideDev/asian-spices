// lib/shipping/types.ts

export type CheapCargoCredentials = {
  apiKey: string;
  email: string;
  password: string;
};

export type AnyProviderCredentials =
  | CheapCargoCredentials
  | Record<string, any>;

// export interface ShippingAdapter {
//   getRates(address: any): Promise<any>;
//   createShipment(order: any): Promise<any>;
//   generateLabel(shipmentId: string): Promise<any>;
// }

export interface ShipmentInput {
  orderId: string;
  to: any;
  from: any;
  parcel: any;
}

export interface ShipmentResult {
  externalId: string;
  trackingNumber?: string;
  labelUrl?: string;
  raw: any;
}

export interface LabelResult {
  url: string;
}

// export interface ShippingAdapter {
//   createShipment(input: ShipmentInput): Promise<ShipmentResult>;
//   getRates(input: ShipmentInput): Promise<any>;
//   generateLabel(externalId: string): Promise<LabelResult>;
// }

export interface ShippingAdapter {
  createShipment(input: ShipmentInput): Promise<ShipmentResult>;
  getRates(input: ShipmentInput): Promise<any>;
  generateLabel(externalId: string): Promise<LabelResult>;

  // 🔥 NEW
  trackShipment(orderNumber: string): Promise<any>;
  cancelShipment(orderId: string, orderNumber: string): Promise<any>;
}