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
  store_id?: string;
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

type PackagingInventoryItem = {
  id: string;
  packaging_type_id: string;
  quantity_available: number;
  name: string;
  sku: string;
  package_type: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  empty_weight_kg: string | number;
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

  // 🚀 Packaging Registry States
  const [packagingOptions, setPackagingOptions] = useState<
    PackagingInventoryItem[]
  >([]);
  const [selectedPackagingId, setSelectedPackagingId] = useState("");

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

  // 🚀 Fetch Packaging Options when Order details are resolved
  useEffect(() => {
    const fetchPackagingData = async () => {
      try {
        const res = await fetch(`/api/store/packaging`);
        if (!res.ok) throw new Error("Failed packing options request");
        const data = await res.json();
        setPackagingOptions(data.inventory || []);
      } catch (err) {
        console.error("Error drawing integration stock:", err);
      }
    };

    fetchPackagingData();
  }, [order]);

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

  // 🚀 Handle Auto-populating Fields from Packaging Selections
  const handlePackagingChange = (packagingTypeId: string) => {
    setSelectedPackagingId(packagingTypeId);
    const box = packagingOptions.find(
      (p) =>
        p.packaging_type_id === packagingTypeId || p.id === packagingTypeId,
    );

    if (box) {
      // Calculate estimated contents weight if available, or start with container floor weight
      const containerTareWeight = Number(box.empty_weight_kg || 0);

      setShipping({
        boxes: "1",
        length: Math.round(Number(box.length_cm || 0)).toString(),
        width: Math.round(Number(box.width_cm || 0)).toString(),
        height: Math.round(Number(box.height_cm || 0)).toString(),
        weight:
          containerTareWeight > 0 ? containerTareWeight.toFixed(2) : "0.10", // Fallback floor constraint
      });
      if (typeof showToast === "function") {
        showToast(
          "success",
          `Applied dimension constraints from preset: ${box.name}`,
        );
      }
    } else {
      setShipping({
        weight: "",
        length: "",
        width: "",
        height: "",
        boxes: "1",
      });
    }
  };

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
        packagingTypeId: selectedPackagingId || null,
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

        {/* Freight and Logistics Control */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 bg-white border p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-gray-700 font-bold text-sm">
              <Printer size={16} />{" "}
              <span>Waybills & Freight Packaging Variables</span>
            </div>

            {/* 🚀 INTEGRATED PACKAGING SELECTION MODULE DROP-DOWN */}
            <div className="text-xs">
              <label className="block text-gray-500 font-medium mb-1">
                Select Active Box Variant from Stock Inventory Template
              </label>
              <select
                value={selectedPackagingId}
                onChange={(e) => handlePackagingChange(e.target.value)}
                disabled={hasShipment}
                className="w-full p-2 border rounded-lg focus:outline-none bg-white font-medium text-gray-700 disabled:bg-gray-50"
              >
                <option value="">
                  -- Manual Dimension Configuration (No Template Chosen) --
                </option>
                {packagingOptions &&
                  packagingOptions.map((box) => {
                    // Parse string decimals smoothly to prevent rendering errors
                    const l = Math.round(Number(box.length_cm || 0));
                    const w = Math.round(Number(box.width_cm || 0));
                    const h = Math.round(Number(box.height_cm || 0));
                    const availableStock =
                      box.quantity_available !== undefined
                        ? box.quantity_available
                        : 0;

                    // Fallback target identifier validation
                    const targetValue = box.packaging_type_id || box.id;

                    return (
                      <option key={box.id || targetValue} value={targetValue}>
                        {box.name || "Unnamed Variant"} ({box.sku || "N/A"}) —{" "}
                        {l}x{w}x{h} cm [Avail: {availableStock}]
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Dimensional Form Variables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 font-medium mb-1">
                  Weight (kg)
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
                  Length (cm)
                </label>
                <input
                  type="number"
                  value={shipping.length}
                  onChange={(e) =>
                    setShipping({ ...shipping, length: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1">
                  Width (cm)
                </label>
                <input
                  type="number"
                  value={shipping.width}
                  onChange={(e) =>
                    setShipping({ ...shipping, width: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={shipping.height}
                  onChange={(e) =>
                    setShipping({ ...shipping, height: e.target.value })
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
              <div>
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
            </div>

            {/* Conditional Action Dispatch Interfaces */}
            {!hasShipment && (
              <button
                onClick={handleShip}
                disabled={
                  shippingLoading || !shipping.weight || !shipping.length
                }
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition"
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
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition"
              >
                {bookingLoading
                  ? "Finalizing Booking Details..."
                  : "Confirm Final Manifest Pickup with Courier"}
              </button>
            )}
            {isBooked && !hasLabel && (
              <button
                onClick={handleGenerateLabel}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
              >
                Generate PDF Shipping Label
              </button>
            )}
            {isBooked && (
              <button
                onClick={handleRefreshTracking}
                disabled={loading}
                className="px-4 py-2 border text-sm font-medium rounded inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 transition"
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
              <span>Tax</span>
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

            {/* {order.tracking_number && ( */}
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
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

