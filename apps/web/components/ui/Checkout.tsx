"use client";

import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import Step from "../layout/checkout/Steps";
import OrderSummary from "../layout/checkout/OrderSummary";
import ContactForm from "../layout/checkout/ContactForm";
import { useState } from "react";
export default function Checkout() {
  const { cart } = useCartStore();
  const [step, setStep] = useState<"contact" | "shipping" | "payment">(
    "contact",
  );
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const total = subtotal;
  //   + shipping + tax;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 cursor-pointer">← Back to Cart</p>
        <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        <p className="text-gray-500">Complete your order in a few easy steps</p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-10 mb-12">
        <Step active label="Contact" />
        <Divider />
        <Step label="Shipping" />
        <Divider />
        <Step label="Payment" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
        {/* Left */}
        <ContactForm />

        {/* Right */}
        <OrderSummary
          items={cart}
          subtotal={subtotal}
          //   shipping={shipping}
          //   tax={tax}
          total={total}
        />
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-20 h-px bg-gray-300" />;
}
