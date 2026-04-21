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
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
      }));
    }
  }, [session]);

  const { cart, clearCart } = useCartStore();

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadDefaultAddress = async () => {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/account/addresses/default");
        const data = await res.json();

        if (!data.address) return;

        const a = data.address;

        setFormData((prev) => ({
          ...prev,
          firstName: a.first_name || prev.firstName,
          lastName: a.last_name || prev.lastName,
          address: a.address_line1 || "",
          appartment: a.address_line2 || "",
          city: a.city || "",
          state: a.state || "",
          zip: a.postal_code || "",
          country: a.country || "NL",
        }));
      } catch (err) {
        console.error("Failed to load default address", err);
      }
    };

    loadDefaultAddress();
  }, [session]);

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
        try {
          console.log("Geocoding address:", address);

          const res = await fetch(
            `/api/geocode?address=${encodeURIComponent(address)}`,
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.error || "Geocoding failed");
          }

          const lat = Number(data?.lat);
          const lng = Number(data?.lng);

          if (isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid coordinates received");
          }

          return { latitude: lat, longitude: lng };
        } catch (error) {
          console.error("Geocode error:", error);
          throw error;
        }
      };

      // Before calling placeOrder:
      if (!formData.latitude || !formData.longitude) {
        const fullAddress = [formData.zip, formData.country]
          .filter(Boolean)
          .join(", ");

        const geo = await geocodeAddress(fullAddress);

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
            longitude: formData.longitude,
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
        
        console.log('orderId ===  ', orderId);
        console.log('total ===  ', total);
        console.log('formData.email ===  ', formData.email);
        console.log('method ===  ', method);

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

        console.log('Failed to initiate payment. Please try again. ===  ', data);

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
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        </div>

        {!isLoggedIn && (
          <div className="bg-yellow-50 p-4 rounded mb-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[60%_35%] gap-8">
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
          </div>

          <OrderSummary items={cart} shippingMethod={shippingMethod} />
        </div>
      </div>
    </div>
  );
}
