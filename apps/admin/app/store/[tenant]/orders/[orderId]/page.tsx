// apps/admin/app/store/[tenant]/orders/[orderId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Package,
  User,
  CreditCard,
  Printer,
  Truck,
} from "react-feather";
import { useToast } from "@repo/ui";
import Link from "next/link";

type OrderItem = {
  order_item_id: string;
  product_id: string;
  name: string;
  sku: string;
  quantity: number;
  fulfilled_quantity: number;
  available_stock?: number;
  price: number;
};

type OrderDetail = {
  id: string;
  order_number: string;
  order_date: string;
  order_status: string;
  payment_status: string;
  fulfillment_status: string;
  total_amount: string | number;
  subtotal: string | number;
  tax_amount: string | number;
  shipping_amount: string | number;
  // customer_name: string;
  // customer_email: string;
  customer_city: string;
  customer_postcode: string;
  tracking_number: string;
  shipping_label: string;
  order_type: "B2C" | "B2B";
  items: OrderItem[];
};

const SHIPPING_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [shippingMethodId, setShippingMethodId] = useState("");
  const [methods, setMethods] = useState<any[]>([]);

  const [shipping, setShipping] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
    boxes: "1",
  });

  const [shippingLoading, setShippingLoading] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        setOrder(data.order);
      } catch {
        showToast("error", "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!order || order.order_status !== "accepted") return;

    fetch(`/api/store/shipping-methods`)
      .then((r) => r.json())
      .then((d) => setMethods(d.methods));
  }, [order]);

  const [shippingStatus, setShippingStatus] = useState("");
  const [provider, setProvider] = useState("cheapcargo");

  useEffect(() => {
    if (order?.fulfillment_status) {
      setShippingStatus(order.fulfillment_status);
    }
  }, [order]);

  // ================= HELPERS =================
  const updateQty = (itemId: string, value: string) => {
    if (!order) return;

    const qty = parseInt(value || "0", 10);

    setOrder((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: prev.items.map((item) =>
          item.order_item_id === itemId
            ? {
                ...item,
                fulfilled_quantity: Math.max(0, Math.min(qty, item.quantity)),
              }
            : item,
        ),
      };
    });
  };

  const isFullPossible =
    order?.items.every((i) => (i.available_stock ?? 0) >= i.quantity) ?? false;

  // ================= DECISION =================
  const handleDecision = async (action: "full" | "partial" | "reject") => {
    try {
      setLoading(true);

      const payload: any = { action };

      if (action === "partial") {
        payload.items = order?.items.map((item) => ({
          item_id: item.order_item_id,
          fulfilled_quantity: item.fulfilled_quantity || item.quantity,
        }));
      }

      const res = await fetch(`/api/orders/${orderId}/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("success", "Order updated");

      window.location.reload();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= SHIPPING =================
  const handleShip = async () => {
    try {
      setShippingLoading(true);

      const res = await fetch("/api/shipping/create-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          shippingMethodId,
          parcel: shipping,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.label?.url) window.open(data.label.url);

      showToast("success", "Shipment created");
      window.location.reload();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setShippingLoading(false);
    }
  };

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        showToast("error", "Could not load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, showToast]);

  if (loading)
    return <div className="p-10 text-center">Loading Order Details...</div>;
  if (!order)
    return <div className="p-10 text-center text-red-500">Order not found</div>;

  const total = Number(order.total_amount);

  const handleAction = async (action: "full" | "partial" | "reject") => {
    try {
      setLoading(true);

      const payload: any = { action };

      // for partial → send current fulfilled qty OR default logic
      if (action === "partial") {
        payload.items = order?.items.map((item) => ({
          item_id: item.order_item_id,
          fulfilled_quantity: item.fulfilled_quantity || item.quantity, // default
        }));
      }

      const res = await fetch(`/api/orders/${orderId}/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      showToast("success", `Order ${action} processed`);

      // refresh
      window.location.reload();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* const handleShipOrder = async () => {
    try {
      setShippingLoading(true);

      // const res = await fetch("/api/shipping/create-shipment", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     orderId,
      //     providerSlug: "cheapcargo", // 🔥 make dynamic later
      //     // storeId: "CURRENT_STORE_ID", // 🔥 pass real tenant/store
      //     shipmentInput: {
      //       weight: shipping.weight,
      //       length: shipping.length,
      //       width: shipping.width,
      //       height: shipping.height,
      //       boxes: shipping.boxes,
      //     },
      //   }),
      // });

      const res = await fetch("/api/shipping/create-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          shippingMethodId, // ✅ IMPORTANT
          parcel: shipping,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      if (data.label?.url) {
        window.open(data.label.url);
      }

      showToast("success", "Shipment created");

      window.location.reload();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setShippingLoading(false);
    }
  }; */

  return (
    <div className="page-wrapper ">
      <div className="content space-y-6">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between bg-gray-50">
          <Link
            href="/orders"
            className="flex items-center text-sm text-gray-600 hover:text-primary transition"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Orders
          </Link>

          <div className="flex gap-2">
            <span
              className={`badge ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-xs font-medium uppercase`}
            >
              {order.payment_status}
            </span>
            <span className="badge bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium uppercase">
              {order.order_type}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Order {order.order_number}
          </h2>
          <p className="text-gray-500">
            Placed on {new Date(order.order_date).toLocaleString()}
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 space-y-6">
          <div className="card bg-white border rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <User size={18} />
              <h4 className="font-bold pt-2">Customer Details</h4>
            </div>
            {/* <p className="font-medium">{order.customer_name}</p>
                  <p className="text-gray-500 text-sm">{order.customer_email}</p> */}
            <p className="text-gray-500 text-sm">
              Postcode: {order.customer_postcode}
            </p>
            <p className="text-gray-500 text-sm">City: {order.customer_city}</p>
          </div>

          <div className="card bg-white border rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <CreditCard size={18} />
              <h4 className="font-bold  pt-2">Payment Status</h4>
            </div>
            <p className="text-sm capitalize">
              Status: <strong>{order.payment_status}</strong>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Transaction verified via Gateway
            </p>
          </div>

          <div className="card bg-white border rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <Truck size={18} />
              <h4 className="font-bold pt-2">Fulfillment</h4>
            </div>

            <p className="text-sm capitalize mb-2">
              Current Status: <strong>{order.fulfillment_status}</strong>
            </p>

            {/* <button
              onClick={() => handleAction("reject")}
              className="btn btn-danger mt-4 w-full"
            >
              Cancel Order
            </button> */}

            {/* ================= DECISION STATE ================= */}
            {order.order_status === "pending" && (
              <div className="flex gap-2">
                <button
                  disabled={!isFullPossible}
                  onClick={() => handleDecision("full")}
                  className="btn btn-success"
                >
                  Accept Full
                </button>

                <button
                  onClick={() => handleDecision("partial")}
                  className="btn btn-warning"
                >
                  Partial
                </button>

                <button
                  onClick={() => handleDecision("reject")}
                  className="btn btn-danger"
                >
                  Reject All
                </button>
              </div>
            )}

            {order.order_status === "rejected" && (
              <div className="text-red-500 font-semibold">Order Rejected</div>
            )}

            {/* {order.fulfillment_status !== "fulfilled" && (
              <div className="flex gap-2">
                <button
                  disabled={!isFullPossible}
                  onClick={() => handleAction("full")}
                >
                  Accept Full
                </button>

                <button onClick={() => handleAction("partial")}>Partial</button>

                <button onClick={() => handleAction("reject")}>
                  Reject All
                </button>
              </div>
            )} */}
          </div>
        </div>

        <div className="w-full">
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                <Package size={18} className="text-gray-400" />
                <h4 className="font-semibold pt-2">Items Summary</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      <th className="p-4 w-[10%]">Product</th>
                      <th className="p-4 text-center">SKU</th>
                      <th className="p-4 text-center">Price</th>
                      <th className="p-4 text-center">Qty</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-center">Ordered</th>
                      {/* <th className="p-4 text-center">Fulfilled</th> */}
                      {order.order_status === "accepted" && (
                        <th className="p-4 text-center">Fulfill</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((item) => (
                      <tr
                        key={item.order_item_id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-4 w-[10%]">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                        </td>
                        <td className="p-4 text-center text-gray-500 text-sm">
                          {item.sku}
                        </td>
                        <td className="p-4 text-center">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">{item.quantity}</td>
                        <td className="p-4 text-right font-medium">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">{item.quantity}</td>

                        {/* <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
   
                            <input
                              type="number"
                              min={0}
                              max={item.quantity}
                              value={item.fulfilled_quantity}
                              onChange={(e) =>
                                updateQty(item.order_item_id, e.target.value)
                              }
                              className={`w-20 text-center border rounded px-2 py-1 ${
                                item.available_stock !== undefined &&
                                item.fulfilled_quantity > item.available_stock
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />

  
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  item.order_item_id,
                                  String(
                                    Math.min(
                                      item.quantity,
                                      item.available_stock ?? item.quantity,
                                    ),
                                  ),
                                )
                              }
                              className="text-xs text-blue-500 hover:underline"
                            >
                              Max
                            </button>


                            {item.available_stock !== undefined && (
                              <span
                                className={`text-xs ${
                                  item.available_stock === 0
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }`}
                              >
                                Available: {item.available_stock}
                              </span>
                            )}
                          </div>
                        </td> */}

                        {order.order_status === "accepted" && (
                          <td>
                            <input
                              type="number"
                              value={item.fulfilled_quantity}
                              onChange={(e) =>
                                updateQty(item.order_item_id, e.target.value)
                              }
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Totals */}
            <div className="card bg-white border rounded-lg shadow-sm p-6 ml-auto max-w-sm">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${Number(order.tax_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 border-b pb-3">
                  <span>Shipping</span>
                  <span>${Number(order.shipping_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-1">
                  <span>Total Amount</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card bg-none  rounded-lg space-x-2 shadow-sm p-6 ml-auto max-w-sm">
              <button
                disabled={!isFullPossible}
                onClick={() => handleAction("full")}
                className="btn btn-success disabled:opacity-50"
              >
                Accept Full
              </button>

              <button
                onClick={() => handleAction("partial")}
                className="btn btn-warning"
              >
                Partial
              </button>

              <button
                onClick={() => handleAction("reject")}
                className="btn btn-danger"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-6 card bg-white border rounded-lg shadow-sm p-5">
          <div className="">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <Printer size={18} />
              <h4 className="font-bold  pt-2">Shipping Detail</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="form-label">
                Weight (kg)<span className="text-danger ms-1">*</span>
              </label>
              <input
                type="number"
                value={shipping.weight}
                className="input w-full form-control"
                onChange={(e) =>
                  setShipping({ ...shipping, weight: e.target.value })
                }
                required
              />

              <label className="form-label">
                Boxes<span className="text-danger ms-1">*</span>
              </label>

              <input
                type="number"
                value={shipping.boxes}
                required
                className="input w-full form-control"
                onChange={(e) =>
                  setShipping({ ...shipping, boxes: e.target.value })
                }
              />

              <label className="form-label">Length</label>

              <input
                className="input w-full form-control"
                onChange={(e) =>
                  setShipping({ ...shipping, length: e.target.value })
                }
              />

              <label className="form-label">Width</label>

              <input
                className="input w-full form-control"
                onChange={(e) =>
                  setShipping({ ...shipping, width: e.target.value })
                }
              />

              <label className="form-label">Height</label>

              <input
                className="input w-full form-control"
                onChange={(e) =>
                  setShipping({ ...shipping, height: e.target.value })
                }
              />
            </div>

            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="input w-full mb-3"
            >
              <option value="cheapcargo">CheapCargo</option>
              <option value="dhl">DHL</option>
            </select>

            <select
              value={shippingMethodId}
              onChange={(e) => setShippingMethodId(e.target.value)}
              className="input w-full"
            >
              <option value="">Select Shipping Method</option>

              {methods.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <button
              // onClick={handleShipOrder}
              onClick={handleShip}
              disabled={shippingLoading}
              className="mt-4 w-full py-2 bg-primary text-white rounded"
            >
              {shippingLoading ? "Processing..." : "Generate Shipping Label"}
            </button>
          </div>

          <div className="border rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-gray-800 pb-2">
              <h4 className="font-bold  pt-2">&nbsp;</h4>
            </div>
            {order.tracking_number && (
              <div className="mt-4 text-center">
                <p className="text-sm">Tracking: {order.tracking_number}</p>
                <img
                  src={order.shipping_label}
                  alt="QR Code"
                  className="mx-auto mt-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
