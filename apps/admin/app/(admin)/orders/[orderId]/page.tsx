// apps/admin/app/(admin)/orders/[orderId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OrderItem = {
  order_item_id: number;
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image?: string;
};

type OrderDetail = {
  order_id: number;
  order_date: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data.order);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (
    <div className="page-wrapper p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
        <p className="text-gray-500">
          Placed on {new Date(order.order_date).toLocaleDateString()}
        </p>
      </div>

      {/* Info Cards */}
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

      {/* Items Table */}
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

      {/* Summary */}
      <div className="card p-4 max-w-sm ml-auto">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${order.total_amount.toFixed(2)}</span>
        </div>
        <p className="mt-2">
          Status: <strong>{order.status}</strong>
        </p>
      </div>
    </div>
  );
}
