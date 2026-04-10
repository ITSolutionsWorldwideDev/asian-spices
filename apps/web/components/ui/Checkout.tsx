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

  latitude?: number;
  longitude?: number;

  cardNumber: string;
  expiry: string;
};

export const SHIPPING_OPTIONS = {
  standard: { label: "Standard Shipping", price: 5.99 },
  express: { label: "Express Shipping", price: 12.99 },
  overnight: { label: "Overnight Shipping", price: 24.99 },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_OPTIONS;

export default function Checkout() {
  const { cart, clearCart } = useCartStore();

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");

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

    latitude: 0,
    longitude: 0,

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
      const geocodeAddress = async (address: string) => {
        const res = await fetch(
          `/api/geocode?address=${encodeURIComponent(address)}`,
        );
        if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();

      if (!data.lat || !data.lng) {
        throw new Error("Unable to resolve address coordinates");
      }
        return { latitude: data.lat, longitude: data.lng };
      };

      // Before calling placeOrder:
      if (!formData.latitude || !formData.longitude) {
        const geo = await geocodeAddress(
          `${formData.address}, ${formData.city}, ${formData.country}`,
        );
        formData.latitude = geo.latitude;
        formData.longitude = geo.longitude;
      }
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
            latitude: formData.latitude,
            longitude: formData.longitude
          },
          cartItems: cart,
          pricing: {
            subtotal,
            discount: 0,
            shipping: SHIPPING_OPTIONS[shippingMethod].price,
            total: subtotal + SHIPPING_OPTIONS[shippingMethod].price,
          },
          shippingMethod,
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
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
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
          {/* <OrderSummary items={cart} subtotal={subtotal} total={total} /> */}
          <OrderSummary items={cart} shippingMethod={shippingMethod} />
        </div>
      </div>
    </div>
  );
}
