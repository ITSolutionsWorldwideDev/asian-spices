// apps/admin/app/store/[tenant]/orders/[orderId]/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Package,
  User,
  CreditCard,
  Printer,
  Truck,
  AlertTriangle,
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
  status?: string;
  payment_status: string;
  fulfillment_status: string;
  total_amount: string | number;
  subtotal: string | number;
  tax_amount: string | number;
  shipping_amount: string | number;

  // Logistics tracking fields
  tracking_number: string | null;
  shipping_label: string | null;
  shipping_provider: string | null;
  shipping_status: string | null;
  shipping_paid: boolean | string | null;
  payment_url: string;

  shipment_id: string | null;
  external_shipment_id: string | null;
  label_url: string | null; // 🚀 Added to satisfy the static compiler check
  tracking_url: string | null;

  customer_city: string;
  customer_postcode: string;
  order_type: "B2C" | "B2B";

  items: OrderItem[];
};

export default function OrderDetailPage() {
  const { tenant, orderId } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingMethodId, setShippingMethodId] = useState("");
  const [methods, setMethods] = useState<any[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [provider, setProvider] = useState("cheapcargo");

  const [shipping, setShipping] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
    boxes: "1",
  });

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Order trace endpoint unreachable");
      const data = await res.json();

      // Ensure local fulfilled fields default safely to order quantity for editing
      if (data.order && data.order.items) {
        data.order.items = data.order.items.map((item: any) => ({
          ...item,
          fulfilled_quantity: item.fulfilled_quantity ?? item.quantity,
        }));
      }

      setOrder(data.order);
    } catch (err) {
      showToast("error", "Failed to resolve active order entity fields");
    } finally {
      setLoading(false);
    }
  }, [orderId, showToast]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!order || order.payment_status !== "paid") return;
      try {
        const res = await fetch(`/api/store/shipping-methods`, {
          credentials: "include",
        });
        if (!res.ok)
          throw new Error("Failed to load global courier pricing models");
        const data = await res.json();
        setMethods(data.methods || []);
      } catch (err) {
        console.error("Shipping service lines extraction lookup loss:", err);
      }
    };
    fetchMethods();
  }, [order]);

  const updateLineFulfillQty = (itemId: string, value: string) => {
    if (!order) return;
    const parsedValue = parseInt(value || "0", 10);

    setOrder((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.order_item_id === itemId
            ? {
                ...item,
                fulfilled_quantity: Math.max(
                  0,
                  Math.min(parsedValue, item.quantity),
                ),
              }
            : item,
        ),
      };
    });
  };

  const handleFulfillmentAction = async (
    action: "full" | "partial" | "reject",
  ) => {
    try {
      setLoading(true);
      const payload: any = { action };

      if (action === "partial") {
        payload.items = order?.items.map((item) => ({
          order_item_id: item.order_item_id,
          fulfilled_quantity: item.fulfilled_quantity,
        }));
      }

      const res = await fetch(`/api/orders/${orderId}/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Fulfillment transformation rejected");

      showToast("success", `Order ${action} action recorded successfully`);
      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= SHIPPING =================

  const normalizeNumber = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const handleShip = async () => {
    if (!shippingMethodId) {
      showToast("error", "Please select a courier dispatch configuration");
      return;
    }

    try {
      setShippingLoading(true);

      const payload = {
        orderId,
        shippingMethodId,
        parcel: {
          weight: normalizeNumber(shipping.weight),
          length: normalizeNumber(shipping.length) || 10,
          width: normalizeNumber(shipping.width) || 10,
          height: normalizeNumber(shipping.height) || 10,
          boxes: normalizeNumber(shipping.boxes) || 1,
        },
      };

      const res = await fetch("/api/shipping/create-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("success", "Carrier parcel entity registered successfully");
      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!order?.shipment_id) {
      showToast("error", "Shipment not found");
      return;
    }

    try {
      setBookingLoading(true);

      const res = await fetch("/api/shipping/confirm-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipmentId: order.shipment_id,
          orderId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      showToast("success", "Booking confirmed");

      await fetchOrder();
    } catch (err: any) {
      console.error("Confirm booking error:", err);
      showToast("error", err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleRefreshTracking = async () => {
    try {
      const res = await fetch("/api/shipping/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Current Status: ${data.statusName}`);
        // router.refresh(); // Hot reload Server Components
      } else {
        alert(`Tracking issue: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateLabel = async () => {
    try {
      setShippingLoading(true);

      const res = await fetch("/api/shipping/generate-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      if (data.labelUrl) {
        window.open(data.labelUrl);
      }
      showToast("success", "Printable manifest configuration loaded");

      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setShippingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-sm">
        Processing and locking core database contexts...
      </div>
    );
  if (!order)
    return (
      <div className="p-10 text-center text-red-500">
        Target system order identity tracking failure
      </div>
    );

  const total = Number(order.total_amount);

  // console.log("order.order_status ==== ", order.order_status);
  const isLocked = [
    "confirmed",
    "partially_confirmed",
    "rejected",
    "cancelled",
  ].includes(order.order_status);

  const hasShipment = !!order.tracking_number || !!order.shipment_id;
  const isBooked =
    order.shipping_status === "booked" ||
    order.shipping_paid === true ||
    order.shipping_paid === "true";

  const hasLabel = !!order.shipping_label || !!(order as any).label_url;

  // const hasShipment = !!order.tracking_number;
  // const isBooked = order.fulfillment_status === "booked";
  // const hasLabel = !!order.shipping_label;

  return (
    <div className="page-wrapper ">
      <div className="content space-y-6">
        {/* Dynamic Header Controls Bar */}
        <div className="flex items-center justify-between bg-white border p-4 rounded-xl shadow-sm">
          <Link
            href={`/store/${tenant}/orders`}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Dashboard Orders
          </Link>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${order.order_status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            >
              Status: {order.order_status}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
              Fulfillment: {order.fulfillment_status}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Order {order.order_number}
          </h2>
          <p className="text-gray-500">
            Placed on {new Date(order.order_date).toLocaleString()}
          </p>
        </div>

        {/* Action Decision Alert Control Interface */}
        {!isLocked && (
          <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <AlertTriangle size={16} /> Fulfillment Allocation Actions
                Pending
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Please specify your physical dispatch items capacities before
                passing to shipping modules.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFulfillmentAction("full")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                Ship Complete
              </button>
              <button
                onClick={() => handleFulfillmentAction("partial")}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                Ship Partial Selection
              </button>
              <button
                onClick={() => handleFulfillmentAction("reject")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                Cancel Allocation (Reject)
              </button>
            </div>
          </div>
        )}

        {/* Context Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-400 uppercase tracking-wider text-xs font-bold border-b pb-1.5">
              <User size={14} /> Shipping Destination
            </div>
            <p className="text-sm font-medium text-gray-800">
              City: {order.customer_city}
            </p>
            <p className="text-sm text-gray-500 font-mono mt-0.5">
              Postcode: {order.customer_postcode}
            </p>
          </div>

          <div className="bg-white border p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-400 uppercase tracking-wider text-xs font-bold border-b pb-1.5">
              <CreditCard size={14} /> Settlement Status
            </div>
            <p className="text-sm font-medium text-gray-800">
              Status:{" "}
              <span className="uppercase font-bold text-gray-900">
                {order.payment_status}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Transaction cleared safely via verified gateway nodes.
            </p>
          </div>

          <div className="bg-white border p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-400 uppercase tracking-wider text-xs font-bold border-b pb-1.5">
              <Truck size={14} /> Core Logistics Pipeline
            </div>
            <p className="text-sm font-medium text-gray-800 capitalize">
              Tracking State:{" "}
              <strong>{order.shipping_status || "Processing"}</strong>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Updates instantly following waybill assignment actions.
            </p>
          </div>
        </div>

        {/* Dynamic Products Selection Matrix Spreadsheet Layout */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <Package size={16} className="text-gray-400" />
            <h4 className="font-semibold text-gray-700 text-sm">
              Line Items Manifest Registry
            </h4>
          </div>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b">
                <th className="p-4">Product Name</th>
                <th className="p-4 text-center">SKU</th>
                {/* <th className="p-4 text-center">Catalog Stock</th> */}
                <th className="p-4 text-center">Ordered Qty</th>
                <th className="p-4 text-center w-36">Dispatch Quantity</th>
                <th className="p-4 text-right">Gross Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item) => (
                <tr
                  key={item.order_item_id}
                  className="hover:bg-gray-50/40 transition"
                >
                  <td className="p-4 font-medium text-gray-900">{item.name}</td>
                  <td className="p-4 text-center text-gray-400 font-mono text-xs">
                    {item.sku}
                  </td>
                  {/* <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${Number(item.available_stock || 0) >= item.quantity ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {item.available_stock ?? 0} In Stock
                  </span>
                </td> */}
                  <td className="p-4 text-center font-bold text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="p-4 text-center">
                    {isLocked ? (
                      <span className="font-bold text-gray-900">
                        {item.fulfilled_quantity} Fulfilling
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.fulfilled_quantity ?? 0}
                        onChange={(e) =>
                          updateLineFulfillQty(
                            item.order_item_id,
                            e.target.value,
                          )
                        }
                        className="w-24 px-2 py-1 border rounded text-center text-sm font-bold bg-gray-50 focus:bg-white focus:outline-none"
                      />
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold text-gray-900">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Breakdown Calculations Dashboard Block Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logistics Shipping Metadata Matrix */}
          <div className="md:col-span-2 bg-white border p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-gray-700 font-bold text-sm">
              <Printer size={16} />{" "}
              <span>Waybills & Freight Configuration Variables</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 font-medium mb-1">
                  Total Weight (kg)
                </label>
                <input
                  type="number"
                  value={shipping.weight}
                  onChange={(e) =>
                    setShipping({ ...shipping, weight: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1">
                  Boxes Count
                </label>
                <input
                  type="number"
                  value={shipping.boxes}
                  onChange={(e) =>
                    setShipping({ ...shipping, boxes: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1">
                  Logistics Core Engine
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none bg-white"
                >
                  <option value="cheapcargo">CheapCargo Ruleset</option>
                  <option value="dhl">DHL Priority Express</option>
                </select>
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-gray-500 font-medium mb-1">
                Active Rate Method Node
              </label>
              <select
                value={shippingMethodId}
                onChange={(e) => setShippingMethodId(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none bg-white"
              >
                <option value="">
                  Select Shipping Courier Pipeline Target...
                </option>
                {methods.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Contextual Action Shipping Flow State Buttons */}
            {!hasShipment && (
              <button
                onClick={handleShip}
                disabled={shippingLoading || !shipping.weight}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                {shippingLoading
                  ? "Creating Manifest..."
                  : "Initialize Courier Waybill Package Instance"}
              </button>
            )}
            {hasShipment && !isBooked && (
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                {bookingLoading
                  ? "Finalizing Booking Details..."
                  : "Confirm Final Manifest Pickup with Courier"}
              </button>
            )}
            {/* isBooked == {isBooked}
            == hasLabel == {hasLabel} */}
            {isBooked && !hasLabel && (
              <button
                onClick={handleGenerateLabel}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                Generate PDF Shipping Label
              </button>
            )}

            {isBooked && (
              <button
                onClick={handleRefreshTracking}
                disabled={loading}
                className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded disabled:opacity-50 inline-flex items-center gap-1.5 transition"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18"
                  />
                </svg>
                {loading ? "Syncing..." : "Refresh Tracking"}
              </button>
            )}

            {hasLabel && (
              <a
                href={
                  order?.shipping_label || (order as any).label_url || undefined
                }
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs font-bold text-blue-600 underline hover:text-blue-800 transition pt-2"
              >
                Open Printable Air Waybill (PDF) ↗
              </a>
            )}
          </div>

          {/* Ledger Balance Sheet Invoice Calculation Node Card Component */}
          <div className="bg-white border rounded-xl shadow-sm p-5 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax Assessment</span>
              <span>${Number(order.tax_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 border-b pb-2">
              <span>Shipping Invoiced Fee</span>
              <span>${Number(order.shipping_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
              <span>Gross Total Amount</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {order.tracking_number && (
              <div className="pt-4 border-t border-dashed mt-4 space-y-2 text-center bg-gray-50 rounded-lg p-3">
                <span className="block text-xs font-mono font-bold text-gray-600 tracking-wider">
                  TRACKING BARCODE: {order.tracking_number}
                </span>
                {order.shipping_label && (
                  <img
                    src={order.shipping_label}
                    alt="Logistics Router Tracking Stamp Map"
                    className="w-28 h-28 mx-auto border rounded-md shadow-inner bg-white mt-1"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* "use client";

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
  status?: string;
  payment_status: string;
  fulfillment_status: string;
  total_amount: string | number;
  subtotal: string | number;
  tax_amount: string | number;
  shipping_amount: string | number;
  shipping_status: string;
  shipping_paid: string;
  payment_url: string;
  // customer_name: string;
  // customer_email: string;
  customer_city: string;
  customer_postcode: string;
  tracking_number: string;
  shipping_label: string;
  order_type: "B2C" | "B2B";

  shipment_id?: string;
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
  const [bookingLoading, setBookingLoading] = useState(false);

  const [shipping, setShipping] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
    boxes: "1",
  });

  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!order || order?.status !== "paid") return;

      try {
        const res = await fetch(`/api/store/shipping-methods`, {
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load methods");
        }

        const data = await res.json();
        setMethods(data.methods || []);
      } catch (err) {
        console.error("Shipping methods error:", err);
        setMethods([]);
      }
    };

    fetchMethods();
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
          fulfilled_quantity: item.fulfilled_quantity ?? 0, // item.fulfilled_quantity || item.quantity,
        }));
      }

      const res = await fetch(`/api/orders/${orderId}/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setOrder({
        ...data.order,
        items: data.order.items.map((item: any) => ({
          ...item,
          fulfilled_quantity: item.fulfilled_quantity ?? 0,
        })),
      });
      if (!res.ok) throw new Error(data.error);

      showToast("success", "Order updated");

      // window.location.reload();
      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= SHIPPING =================

  const normalizeNumber = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const handleShip = async () => {
    if (!shippingMethodId) {
      showToast("error", "Please select a shipping method");
      return;
    }

    try {
      setShippingLoading(true);

      const payload = {
        orderId,
        shippingMethodId,
        parcel: {
          weight: normalizeNumber(shipping.weight),
          length: normalizeNumber(shipping.length) || 10,
          width: normalizeNumber(shipping.width) || 10,
          height: normalizeNumber(shipping.height) || 10,
          boxes: normalizeNumber(shipping.boxes) || 1,
        },
      };

      const res = await fetch("/api/shipping/create-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("success", "Shipment created");
      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!order?.shipment_id) {
      showToast("error", "Shipment not found");
      return;
    }

    try {
      setBookingLoading(true);

      const res = await fetch("/api/shipping/confirm-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipmentId: order.shipment_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      showToast("success", "Booking confirmed");

      await fetchOrder();
    } catch (err: any) {
      console.error("Confirm booking error:", err);
      showToast("error", err.message);
    } finally {
      setBookingLoading(false);
    }
  };


  const isValid = shipping.weight && shipping.boxes;

  const [updating, setUpdating] = useState(false);

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


      if (action === "partial") {
        payload.items = order?.items.map((item) => ({
          item_id: item.order_item_id,
          fulfilled_quantity: item.fulfilled_quantity ?? 0,
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


      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLabel = async () => {
    try {
      setShippingLoading(true);

      const res = await fetch("/api/shipping/generate-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);



      if (data.labelUrl) {
        window.open(data.labelUrl);
      }

      showToast("success", "Label generated");

      await fetchOrder();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setShippingLoading(false);
    }
  };

  console.log('order === ',order);

  const hasShipment = !!order.tracking_number;

  const isBooked = order.fulfillment_status === "booked";
  const hasLabel = !!order.shipping_label;

  const isLocked = ["confirmed", "partially_confirmed", "rejected"].includes(
    order.order_status,
  );

  return (
    <div className="page-wrapper ">
      <div className="content space-y-6">
    
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
            <span
              className={`badge ${
                order.shipping_paid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.shipping_paid ? "Booked" : "Pending Booking"}
            </span>

      
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
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-center">Ordered</th>
                      {order.order_status === "pending" && (
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
                        <td className="p-4 text-right font-medium">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">{item.quantity}</td>

      
                        {order.order_status === "pending" && (
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
                disabled={isLocked || !isFullPossible}
                onClick={() => handleAction("full")}
                className="btn btn-success disabled:opacity-50"
              >
                Accept Full
              </button>

              <button
                disabled={isLocked}
                onClick={() => handleAction("partial")}
                className="btn btn-warning disabled:opacity-50"
              >
                Partial
              </button>

              <button
                disabled={isLocked}
                onClick={() => handleAction("reject")}
                className="btn btn-danger disabled:opacity-50"
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

              <label className="form-label">Select Provider</label>

              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="input w-full mb-3 form-control"
              >
                <option value="cheapcargo">CheapCargo</option>
                <option value="dhl">DHL</option>
              </select>

              <label className="form-label">Select Shipping Method</label>

              <select
                value={shippingMethodId}
                onChange={(e) => setShippingMethodId(e.target.value)}
                className="input w-full mb-3 form-control"
              >
                <option value="">Select Shipping Method</option>

                {methods.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            ================= SHIPPING ACTIONS =================
            1. NO SHIPMENT
            {!hasShipment && (
              <button
                onClick={handleShip}
                disabled={shippingLoading || !isValid}
                className="mt-4 w-full py-2 bg-primary text-white rounded"
              >
                {shippingLoading ? "Processing..." : "Create Shipment"}
              </button>
            )}
            2. SHIPMENT CREATED BUT NOT PAID

            {hasShipment && !isBooked && (
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="mt-3 w-full py-2 bg-orange-600 text-white rounded"
              >
                {bookingLoading ? "Confirming..." : "Confirm Booking"}
              </button>
            )}
            3. BOOKED BUT NO LABEL
            {isBooked && !hasLabel && (
              <button
                onClick={handleGenerateLabel}
                className="mt-4 w-full py-2 bg-green-600 text-white rounded"
              >
                Generate Label
              </button>
            )}
             4. LABEL READY
            {hasLabel && (
              <a
                href={order.shipping_label}
                target="_blank"
                className="mt-4 block text-center text-blue-600 underline"
              >
                View Label
              </a>
            )}
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
 */
