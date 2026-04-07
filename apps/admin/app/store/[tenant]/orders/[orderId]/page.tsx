// apps/admin/app/store/[tenant]/orders/[orderId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, Package, User, CreditCard, Truck } from "react-feather";
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
  created_at: string;
  payment_status: string;
  fulfillment_status: string;
  total_amount: string | number;
  subtotal: string | number;
  tax_amount: string | number;
  shipping_amount: string | number;
  customer_name: string;
  customer_email: string;
  order_type: "B2C" | "B2B";
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();

        console.log("data.order === ", data.order);
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

  const updateQty = (itemId: string, value: string) => {
    if (!order) return;

    const qty = parseInt(value || "0", 10);

    setOrder((prev) => {
      if (!prev) return prev;

      const updatedItems = prev.items.map((item) => {
        if (item.order_item_id !== itemId) return item;

        const safeQty = Math.max(0, Math.min(qty, item.quantity));

        return {
          ...item,
          fulfilled_quantity: safeQty,
        };
      });

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const isFullPossible = order.items.every(
    (i) => (i.available_stock ?? 0) >= i.quantity,
  );

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

  return (
    <div className="page-wrapper p-6 space-y-6">
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
          Placed on {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
              <Package size={18} className="text-gray-400" />
              <h4 className="font-semibold">Items Summary</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    <th className="p-4">Product</th>
                    <th className="p-4 text-center">SKU</th>
                    <th className="p-4 text-center">Price</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-center">Ordered</th>
                    <th className="p-4 text-center">Fulfilled</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr
                      key={item.order_item_id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
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

                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {/* Quantity Input */}
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

                          {/* Max Button */}
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

                          {/* Stock Info */}
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
                      </td>

                      {/* <td className="p-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={item.quantity}
                          value={item.fulfilled_quantity}
                          onChange={(e) =>
                            updateQty(item.order_item_id, e.target.value)
                          }
                          className="w-20 text-center border rounded"
                        />
                      </td> */}
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
        </div>

        {/* Right Column: Customer & Logistics Info */}
        <div className="space-y-6">
          <div className="card bg-white border rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <User size={18} />
              <h4 className="font-bold">Customer Details</h4>
            </div>
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-gray-500 text-sm">{order.customer_email}</p>
          </div>

          <div className="card bg-white border rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
              <CreditCard size={18} />
              <h4 className="font-bold">Payment Status</h4>
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
              <h4 className="font-bold">Fulfillment</h4>
            </div>
            <p className="text-sm capitalize">
              Status: <strong>{order.fulfillment_status}</strong>
            </p>
            <button className="mt-4 w-full py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition">
              Update Shipping Status
            </button>
          </div>

          <div className="flex gap-2 mt-4">
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
    </div>
  );
}

/* 
      <div>
        <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
        <p className="text-gray-500">
          Placed on {new Date(order.order_date).toLocaleDateString()}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h4 className="font-semibold mb-2">Customer</h4>
          <p>{order.customer_name}</p>
          <p className="text-gray-500">{order.customer_email}</p>
        </div>

        <div className="card p-4">
          <h4 className="font-semibold mb-2">Shipping</h4>
          <p>{order.shipping_address}</p>
        </div>

        <div className="card p-4">
          <h4 className="font-semibold mb-2">Payment</h4>
          <p>Method: {order.payment_method}</p>
          <p>Ref: {order.payment_reference}</p>
        </div>
      </div>


      <div className="card p-4">
        <h4 className="font-semibold mb-4">Order Items</h4>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2">SKU</th>
              <th className="p-2">Price</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.order_item_id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.sku}</td>
                <td className="p-2 text-center">${item.price.toFixed(2)}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-center">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="card p-4 max-w-sm ml-auto">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${order.total_amount.toFixed(2)}</span>
        </div>
        <p className="mt-2">
          Status: <strong>{order.status}</strong>
        </p>
      </div> */
