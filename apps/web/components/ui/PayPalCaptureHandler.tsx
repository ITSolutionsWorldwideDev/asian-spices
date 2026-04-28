// apps/web/components/ui/PayPalCaptureHandler.tsx

"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function PayPalCaptureHandler({
  orderId,
  token,
}: {
  orderId: string;
  token: string;
}) {
  const clearCart = useCartStore((s) => s.clearCart);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!orderId || !token) return;
    if (hasRun.current) return;

    const capture = async () => {
      try {
        hasRun.current = true;

        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId: token,
            orderId,
          }),
        });

        if (!res.ok) {
          throw new Error("PayPal capture failed");
        }

        clearCart();
      } catch (err) {
        console.error("PayPal capture failed", err);
      }
    };

    capture();
  }, [orderId, token, clearCart]);

  return null;
}