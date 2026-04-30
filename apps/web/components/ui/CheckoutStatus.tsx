// apps/web/components/ui/CheckoutStatus.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import OrderSummary from "@/components/layout/checkout/OrderSummary";
import RetryPaymentButton from "@/components/ui/RetryPaymentButton";
import OrderTimeline from "@/components/ui/OrderTimeline";
import { useLoaderStore } from "@/store/useLoaderStore";
import { useCartStore } from "@/store/useCartStore";

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  payment_status: "pending" | "paid" | "failed";
  order_status: string;
  payment_method: string;
  transaction_id: string;
  shipping_method: "standard" | "express" | "overnight";
  cart_items: any[];
  customer_email: string;
}

export default function CheckoutStatus({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { show, hide } = useLoaderStore();
  const { clearCart } = useCartStore();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        show("Checkout Status...");
        const res = await fetch(`/api/get-order?orderId=${orderId}`);
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        hide();
      }
    };

    fetchOrder();

    // 🔥 polling for Pay.nl webhook updates
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return <p className="text-center mt-10">Checking payment status...</p>;
  }

  if (!order) {
    return <p className="text-center text-red-500">Order not found</p>;
  }

  useEffect(() => {
    if (order?.payment_status === "paid") {
      clearCart();
    }
  }, [order?.payment_status]);

  // =========================
  // UI STATES
  // =========================

  if (order.payment_status === "paid") {
    return (
      <div className="bg-green-50 border p-6 rounded">
        <h2 className="text-green-700 text-xl font-bold">
          ✅ Payment Successful
        </h2>
        <p>Order #{order.order_number} has been confirmed.</p>

        <OrderSummary
          items={order.cart_items}
          shippingMethod={order.shipping_method}
        />
      </div>
    );
  }

  if (order.payment_status === "failed") {
    return (
      <div className="bg-red-50 border p-6 rounded">
        <h2 className="text-red-700 text-xl font-bold">❌ Payment Failed</h2>

        <OrderTimeline status={order.payment_status} />

        <RetryPaymentButton
          orderId={order.id}
          amount={order.total_amount}
          email={order.customer_email || ""}
        />
        {/* <p>Your payment was not completed.</p>

        <Link
          href="/checkout"
          className="text-blue-600 underline mt-4 inline-block"
        >
          Try Again
        </Link> */}
      </div>
    );
  }

  // default = pending
  return (
    <div className="bg-yellow-50 border p-6 rounded">
      <h2 className="text-yellow-700 text-xl font-bold">⏳ Payment Pending</h2>

      <p>
        We are waiting for confirmation from{" "}
        <strong>
          {order.payment_method === "paypal" ? "PayPal" : "Pay.nl"}
        </strong>
        .
      </p>

      {/* <p>
        We are waiting for confirmation from{" "}
        <strong>Pay.nl</strong>.
      </p> */}

      <p className="text-sm mt-2 text-gray-600">
        This page will update automatically.
      </p>

      <OrderSummary
        items={order.cart_items}
        shippingMethod={order.shipping_method}
      />

      <OrderTimeline status={order.payment_status} />
    </div>
  );
}
