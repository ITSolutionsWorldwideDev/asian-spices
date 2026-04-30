// components/account/orders/OrderCard.tsx

"use client";

import { Eye } from "lucide-react";

export default function OrderCard({ order, onView }: any) {
  return (
    <div className="border rounded-2xl p-5 bg-white hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">#{order.order_number}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            order.order_status === "confirmed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {order.order_status}
        </span>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            order.payment_status === "paid"
              ? "bg-green-100 text-green-600"
              : order.payment_status === "failed"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {order.payment_status}
        </span>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold">${order.total_amount}</p>

        <button
          onClick={() => onView(order)}
          className="flex items-center gap-1 text-sm text-blue-600"
        >
          <Eye size={16} /> View
        </button>
      </div>
    </div>
  );
}
