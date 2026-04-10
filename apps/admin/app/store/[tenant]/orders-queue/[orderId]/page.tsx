// apps/admin/app/store/[tenant]/orders-queue/[orderId]/page.tsx

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
  customer_name: string;
  customer_email: string;
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
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const [shippingStatus, setShippingStatus] = useState("");

  useEffect(() => {
    if (order?.fulfillment_status) {
      setShippingStatus(order.fulfillment_status);
    }
  }, [order]);

  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders-queue/${orderId}`);
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

  const handleDecision = async (action: "approve" | "reject") => {
    try {
      setLoading(true);

      const res = await fetch(`/api/orders/${orderId}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      showToast("success", `Order ${action}d successfully`);

      window.location.reload();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

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

            {order.order_status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision("approve")}
                  className="btn btn-success"
                >
                  Approve Order
                </button>

                <button
                  onClick={() => handleDecision("reject")}
                  className="btn btn-danger"
                >
                  Reject Order
                </button>
              </div>
            )}

            {/* <button
              onClick={() => handleAction("reject")}
              className="btn btn-danger mt-4 w-full"
            >
              Cancel Order
            </button> */}
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
        </div>
      </div>
    </div>
  );
}
