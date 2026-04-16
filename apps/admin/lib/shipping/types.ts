// lib/shipping/types.ts
export interface ShippingAdapter {
  getRates(address: any): Promise<any>;
  createShipment(order: any): Promise<any>;
  generateLabel(shipmentId: string): Promise<any>;
}