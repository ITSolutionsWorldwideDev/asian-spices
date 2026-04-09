// apps/web/components/ui/CheckoutSuccess.tsx
"use client";

import { useEffect, useState } from "react";
import OrderSummary from "@/components/layout/checkout/OrderSummary";

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  transaction_id: string;
  payment_method: string;
  shipping_method: "standard" | "express" | "overnight";
  cart_items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

interface Props {
  orderId: string;
}

export default function CheckoutSuccess({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/get-order?orderId=${orderId}`);
        const data = await res.json();

        if (!data.success) {
          setError("Order not found or failed to fetch.");
          setLoading(false);
          return;
        }

        setOrder(data.order);

        const shippingMethod = data.order.shipping_method || "standard";
      } catch (err) {
        console.error(err);
        setError("Something went wrong fetching your order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Order Status</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
        <p>
          <span className="font-medium">Order Number:</span>{" "}
          {order.order_number}
        </p>
        <p>
          <span className="font-medium">Payment Status:</span>{" "}
          <span
            className={
              order.payment_status === "paid"
                ? "text-green-600 font-semibold"
                : "text-orange-500 font-semibold"
            }
          >
            {order.payment_status.toUpperCase()}
          </span>
        </p>
        <p>
          <span className="font-medium">Order Status:</span>{" "}
          {order.order_status}
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {order.payment_method.toUpperCase()}
        </p>
        <p>
          <span className="font-medium">Transaction ID:</span>{" "}
          {order.transaction_id || "-"}
        </p>

        <hr />

        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <OrderSummary
          items={order.cart_items}
          shippingMethod={order.shipping_method || "standard"}
        />

        <p>
          <span className="font-medium">Shipping Method:</span>{" "}
          {order.shipping_method?.toUpperCase()}
        </p>

        {order.payment_status !== "paid" && (
          <p className="text-orange-600 font-medium mt-4">
            Your payment is still pending. Once confirmed, this page will update
            automatically.
          </p>
        )}
      </div>
    </div>
  );
}
