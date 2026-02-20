// apps/admin/app/(admin)/customers/[customerId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Customer = {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  total_orders: number;
  total_spent: number;
};

type Address = {
  address_id: number;
  address_line1: string;
  city: string;
  country: string;
  is_default: boolean;
};

type Order = {
  order_id: number;
  order_date: string;
  status: string;
  total_amount: number;
};

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch(`/api/customers/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setCustomer(data.customer);
        setAddresses(data.addresses);
      });

    fetch(`/api/customers/${customerId}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data.items));
  }, [customerId]);

  const toggleStatus = async () => {
    const newStatus = customer?.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    await fetch(`/api/customers/${customerId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });

    setCustomer({ ...customer!, status: newStatus });
  };

  if (!customer) return <p className="p-6">Loading...</p>;

  return (
    <div className="page-wrapper p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {customer.first_name} {customer.last_name}
        </h2>

        <button
          onClick={toggleStatus}
          className={`px-4 py-2 rounded text-white ${
            customer.status === "ACTIVE" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {customer.status === "ACTIVE" ? "Block" : "Unblock"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">Orders: {customer.total_orders}</div>
        <div className="card p-4">
          Spent: ${customer.total_spent.toFixed(2)}
        </div>
        <div className="card p-4">Status: {customer.status}</div>
      </div>

      {/* Addresses */}
      <div className="card p-4">
        <h4 className="font-semibold mb-3">Addresses</h4>
        {addresses.map(a => (
          <p key={a.address_id}>
            {a.address_line1}, {a.city}, {a.country}
            {a.is_default && " (Default)"}
          </p>
        ))}
      </div>

      {/* Orders */}
      <div className="card p-4">
        <h4 className="font-semibold mb-3">Order History</h4>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.order_id}>
                <td>
                  <Link href={`/admin/orders/${o.order_id}`}>
                    #{o.order_id}
                  </Link>
                </td>
                <td>{new Date(o.order_date).toLocaleDateString()}</td>
                <td>{o.status}</td>
                <td>${o.total_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
