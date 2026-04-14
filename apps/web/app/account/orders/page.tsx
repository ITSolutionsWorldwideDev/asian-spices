// apps/web/app/account/orders/page.tsx

"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/layout/account/orders/OrderCard";
import OrderDrawer from "@/components/layout/account/orders/OrderDrawer";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/account/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Order History</h1>

      <div className="grid gap-4">
        {orders.map((o: any) => (
          <OrderCard key={o.id} order={o} onView={setSelected} />
        ))}
      </div>

      <OrderDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}