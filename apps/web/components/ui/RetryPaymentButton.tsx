// apps/web/components/ui/RetryPaymentButton.tsx

"use client";

import { useState } from "react";

export default function RetryPaymentButton({
  orderId,
  amount,
  email,
}: {
  orderId: string;
  amount: number;
  email: string;
}) {
  const [loading, setLoading] = useState(false);

  const retryPayment = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          customerEmail: email,
          paymentMethod: "paynl",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Retry failed. Please try again.");
        return;
      }

      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={retryPayment}
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded mt-4"
    >
      {loading ? "Redirecting..." : "Retry Payment"}
    </button>
  );
}