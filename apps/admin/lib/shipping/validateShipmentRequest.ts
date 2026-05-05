// apps/admin/lib/shipping/validateShipmentRequest.ts

export function validateShipmentRequest({
  order,
  method,
  parcel,
}: {
  order: any;
  method: any;
  parcel: any;
}) {
  // --------------------
  // Order validation
  // --------------------
  if (!order) throw new Error("Order not found");

  if (order.fulfillment_status === "shipped") {
    throw new Error("Order already shipped");
  }

  if (order.order_status === "cancelled") {
    throw new Error("Cannot ship cancelled order");
  }

  if (!order.items || order.items.length === 0) {
    throw new Error("Order has no items");
  }

  // --------------------
  // Shipping method validation
  // --------------------
  if (!method) throw new Error("Shipping method not found");

  if (!method.provider_id) {
    throw new Error("Shipping method is not API-enabled");
  }

  // console.log('parcel ==== ',parcel);

  // --------------------
  // Parcel validation
  // --------------------
  const weight = Number(parcel?.weight);

  if (!weight || weight <= 0) {
    throw new Error("Invalid parcel weight");
  }

  const boxes = Number(parcel?.boxes ?? 1);

  if (boxes <= 0) {
    throw new Error("Invalid number of boxes");
  }

  // optional dimensions validation
  const validateDim = (val: any, name: string) => {
    if (val !== undefined && val !== "" && isNaN(Number(val))) {
      throw new Error(`Invalid ${name}`);
    }
  };

    // console.log('validateDim ==== ',validateDim);

  validateDim(parcel?.length, "length");
  validateDim(parcel?.width, "width");
  validateDim(parcel?.height, "height");

  return true;
}