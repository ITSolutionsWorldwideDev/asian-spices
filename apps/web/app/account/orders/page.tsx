// apps/web/app/account/orders/page.tsx

"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/layout/account/orders/OrderCard";
import OrderDrawer from "@/components/layout/account/orders/OrderDrawer";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const { show, hide } = useLoaderStore();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        show("Loading Orders...");

        // 1️⃣ Fetch orders
        const res = await fetch("/api/account/orders");
        const data = await res.json();

        if (!data?.orders) {
          setOrders([]);
          return;
        }

        // 2️⃣ Check pending payments (proper async handling)
        await Promise.all(
          data.orders.map(async (order: any) => {
            if (order.payment_status === "pending") {
              try {
                await fetch("/api/paynl/check-status", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: order.id }),
                });
              } catch (err) {
                console.error("Status check failed:", err);
              }
            }
          })
        );

        // 3️⃣ Refetch updated orders (IMPORTANT)
        const updatedRes = await fetch("/api/account/orders");
        const updatedData = await updatedRes.json();

        setOrders(updatedData.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        hide();
      }
    };

    loadOrders();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={setSelected}
            />
          ))}
        </div>
      )}

      <OrderDrawer
        order={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

/* "use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/layout/account/orders/OrderCard";
import OrderDrawer from "@/components/layout/account/orders/OrderDrawer";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState<any>(null);

  // useEffect(() => {
  //   fetch("/api/account/orders")
  //     .then((res) => res.json())
  //     .then((data) => setOrders(data.orders));
  // }, []);

  useEffect(() => {
    const loadOrders = async () => {
      const res = await fetch("/api/account/orders");
      const data = await res.json();

      setOrders(data.orders);

      // 🔥 verify pending payments
      data.orders.forEach(async (order: any) => {
        if (order.payment_status === "pending") {
          await fetch("/api/paynl/check-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.id }),
          });
        }
      });
    };

    loadOrders();
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
 */