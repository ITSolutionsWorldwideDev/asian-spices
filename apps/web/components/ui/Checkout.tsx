"use client";

import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import Step from "../layout/checkout/Steps";
import OrderSummary from "../layout/checkout/OrderSummary";
import ContactForm from "../layout/checkout/ContactForm";
import { useState } from "react";
import Nav from "./Nav";
import { ArrowLeft } from "lucide-react";
// import { Link } from "lucide-react";
import Link from "next/link";
import ShippingForm from "../layout/checkout/ShippingForm";
import PaymentForm from "../layout/checkout/PaymentForm";
export default function Checkout() {
  const { cart } = useCartStore();
  const [step, setStep] = useState<"contact" | "shipping" | "payment">(
    "contact",
  );
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  console.log(step);
  const total = subtotal;
  //   + shipping + tax;

  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 cursor-pointer flex items-center">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
          <p className="text-gray-500">
            Complete your order in a few easy steps
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-10 mb-12">
          <Step currentStep={step} setStep={setStep} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_35%] items-start gap-8">
          {/* Left */}

          {step === "contact" && <ContactForm setStep={setStep}/>}
          {step === "shipping" && <ShippingForm  setStep={setStep}/>}
          {step === "payment" && <PaymentForm />}

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
    </div>
  );
}

// function Divider() {
//   return <div className="w-20 h-px bg-gray-300" />;
// }
