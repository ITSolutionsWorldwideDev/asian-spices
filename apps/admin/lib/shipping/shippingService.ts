// lib/shipping/shippingService.ts

import { getShippingProvider } from "./providerFactory";

export async function createShipmentForOrder(
  order: any,
  providerSlug: string
) {
  const provider = await getShippingProvider(providerSlug);

  const shipment = await provider.createShipment(order);

  let label = null;
  try {
    label = await provider.generateLabel(shipment.id);
  } catch (err) {
    console.warn("Label generation failed", err);
  }

  return { shipment, label };
}