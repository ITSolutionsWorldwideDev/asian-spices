// apps/web/components/ui/Checkout.tsx

"use client";

import { useCartStore } from "@/store/useCartStore";
import OrderSummary from "../layout/checkout/OrderSummary";
import ContactForm from "../layout/checkout/ContactForm";
import ShippingForm from "../layout/checkout/ShippingForm";
import PaymentForm from "../layout/checkout/PaymentForm";
import Nav from "./Nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { checkoutSchema } from "@/lib/validation/checkout";
export type CheckoutData = {
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
  const { cart, clearCart } = useCartStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    country: "NL",

    cardNumber: "",
    expiry: "",
  });
  const isFormValid = checkoutSchema.safeParse(formData).success;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const total = subtotal;

  const placeOrder = async (method: "paynl" | "paypal") => {
    // Validate form
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (field) fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);

      // Scroll + focus first error
      const firstField = result.error.issues[0]?.path[0] as string;

      if (firstField) {
        const el = document.querySelector(
          `[name="${firstField}"]`,
        ) as HTMLInputElement | null;

        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      return;
    }

    setErrors({});

    try {
      // Create Order

      const res = await fetch("/api/create-order", {
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
            subtotal,
            discount: 0,
            shipping: 200,
            total,
          },
          payment_status: "pending",
          order_status: "pending",
        }),
      });
      const order = await res.json();

      if (!order.success) {
        throw new Error("Order creation failed");
      }

      const orderId = order.orderId;

      // Initiate payment
      if (method === "paynl" || method === "paypal") {
        const payment = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: total,
            customerEmail: formData.email,
            paymentMethod: method,
          }),
        });

        const data = await payment.json();

        if (!data.success) {
          alert("Failed to initiate payment. Please try again.");
          return;
        }
        // Redirect user to payment gateway
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  /* const placeOrder = async () => {
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
          subtotal,
          discount: 0,
          shipping: 200,
          total,
        },
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order placed!");
      clearCart();
    } else {
      alert("Error placing order");
    }
  }; */

  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_35%] gap-8">
          {/* LEFT - Single Flow */}
          <div className="space-y-8">
            <ContactForm
              data={formData}
              setFormData={setFormData}
              errors={errors}
            />
            <ShippingForm
              data={formData}
              setFormData={setFormData}
              errors={errors}
            />
            <PaymentForm placeOrder={placeOrder} disabled={!isFormValid} />
            {/* <PaymentForm placeOrder={placeOrder} /> */}
            {/* <PaymentForm
              data={formData}
              setFormData={setFormData}
              placeOrder={placeOrder}
            /> */}
          </div>

          {/* RIGHT */}
          <OrderSummary items={cart} subtotal={subtotal} total={total} />
        </div>
      </div>
    </div>
  );
}
