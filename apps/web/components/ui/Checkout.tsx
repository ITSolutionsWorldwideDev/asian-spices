"use client";

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
// import { clear } from "console";

type CheckoutData = {
  email: string;
  phone: string;

  firstName: string;
  lastName: string;
  address: string;
  appartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  cardNumber: string;
  expiry: string;
};

export default function Checkout() {
  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    phone: "",

    firstName: "",
    lastName: "",
    address: "",
    appartment: "",
    city: "",
    state: "",
    zip: "",
    country: "",

    cardNumber: "",
    expiry: "",
  });

  // console.log(formData);

  const placeOrder = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },

        shippingAddress: {
          address_line1: formData.address,
          address_line2: formData.appartment,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zip,
          country: formData.country,
        },

        cartItems: cart,
        pricing: {
          subtotal: subtotal,
          discount: 0,
          shipping: 200,
          total: total,
        },
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order placed!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        appartment: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        cardNumber: "",
        expiry: "",
      });

      clearCart();
    } else {
      alert("Error placing order");
    }
  };
  const { cart,clearCart } = useCartStore();

  const [step, setStep] = useState<"contact" | "shipping" | "payment">(
    "contact",
  );
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // console.log(step);
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

          {step === "contact" && (
            <ContactForm
              setStep={setStep}
              data={formData}
              setFormData={setFormData}
            />
          )}
          {step === "shipping" && (
            <ShippingForm
              setStep={setStep}
              data={formData}
              setFormData={setFormData}
            />
          )}
          {step === "payment" && (
            <PaymentForm
              setStep={setStep}
              data={formData}
              setFormData={setFormData}
              placeOrder={placeOrder}
            />
          )}

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
