// apps/admin/app/platform/orders/[orderId]/page.tsx

// apps/admin/app/platform/orders/[orderId]/page.tsx

import { requirePlatformAdmin } from "@/lib/auth/guards";
import OrderDetailsClient from "./OrderDetailsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  await requirePlatformAdmin();

  const { orderId } = await params;

  return <OrderDetailsClient orderId={orderId} />;
}
/* "use client";

import { useEffect, useState } from "react";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import OrderTimeline from "@/components/platform/orders/OrderTimeline";

export default async function OrderDetails({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  await requirePlatformAdmin();

  const { orderId } = await params;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`/api/orders/${orderId}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events));
  }, [orderId]);

  const action = async (type: string) => {
    await fetch(`/api/orders/${orderId}/action`, {
      method: "POST",
      body: JSON.stringify({ action: type }),
    });

    location.reload();
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Order Details</h1>

  
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => action("reassign")}
              className="bg-blue-500 text-white px-3 py-1"
            >
              Reassign
            </button>

            <button
              onClick={() => action("force_default")}
              className="bg-yellow-500 text-white px-3 py-1"
            >
              Default Store
            </button>

            <button
              onClick={() => action("cancel")}
              className="bg-red-500 text-white px-3 py-1"
            >
              Cancel
            </button>
          </div>

      
          <OrderTimeline events={events} />
        </div>
      </div>
    </div>
  );
} */
