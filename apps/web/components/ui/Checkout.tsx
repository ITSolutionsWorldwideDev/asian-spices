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
import { useLoaderStore } from "@/store/useLoaderStore";
import { calculateTotals, convertTotals } from "@/lib/pricing";
import { SHIPPING_OPTIONS, ShippingMethod } from "@/lib/pricing";

import { useCurrencyStore } from "@/store/useCurrencyStore";

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

// export const SHIPPING_OPTIONS = {
//   standard: { label: "Standard Shipping", price: 5.99 },
//   express: { label: "Express Shipping", price: 12.99 },
//   overnight: { label: "Overnight Shipping", price: 24.99 },
// } as const;

// export type ShippingMethod = keyof typeof SHIPPING_OPTIONS;

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

  const { show, hide } = useLoaderStore();

  const { cart, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!session?.user) return;

      try {
        show("Loading Addresses...");

        const res = await fetch("/api/account/addresses");
        const data = await res.json();

        setAddresses(data.addresses || []);

        const defaultAddr = data.addresses?.find((a: any) => a.is_default);

        if (defaultAddr) {
          setSelectedAddress(defaultAddr);

          setFormData((prev) => ({
            ...prev,
            firstName: defaultAddr.first_name || "",
            lastName: defaultAddr.last_name || "",
            address: defaultAddr.address_line1 || "",
            appartment: defaultAddr.address_line2 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            zip: defaultAddr.postal_code || "",
            country: defaultAddr.country || "NL",
          }));
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        hide(); 
      }
    };

    loadAddresses();
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

  // const { subtotal, tax, shipping, total } = calculateTotals(
  //   cart,
  //   shippingMethod,
  // );

  const totals = calculateTotals(cart, shippingMethod);
  const { rate, selectedCurrency } = useCurrencyStore();
  const convertedTotals = convertTotals(totals, rate, selectedCurrency);

  /* const converted = convertTotals(
  { subtotal, tax, shipping, total },
  rate,
  selectedCurrency
);
 */
  // const subtotal = cart.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0,
  // );

  // const total = subtotal;

  // const TAX_RATE = 0.08;

  // const tax_amount = subtotal * TAX_RATE;
  // const tax_amount = tax;

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
      show("Placing your order..."); // 🔥 START LOADER
      const geocodeAddress = async (address: string) => {
        try {
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

      /*  finally {
          hide(); 
        } */

      // Before calling placeOrder:
      if (!formData.latitude || !formData.longitude) {
        const fullAddress = [formData.zip, formData.country]
          .filter(Boolean)
          .join(", ");

        const geo = await geocodeAddress(fullAddress);

        formData.latitude = geo.latitude;
        formData.longitude = geo.longitude;

        // setFormData((prev) => ({
        //   ...prev,
        //   latitude: geo.latitude,
        //   longitude: geo.longitude,
        // }));
      }
      // Create Order

      // console.log("subtotal ====", convertedTotals.subtotal);
      // console.log("tax ====", convertedTotals.tax);
      // console.log("total ====", convertedTotals.total);
      // return false;

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
            subtotal: convertedTotals.subtotal,
            discount: 0,
            tax_amount: convertedTotals.tax,
            shipping: convertedTotals.shipping, // SHIPPING_OPTIONS[shippingMethod].price,
            total: convertedTotals.total, // subtotal + SHIPPING_OPTIONS[shippingMethod].price,
          },
          shippingMethod,
          payment_status: "pending",
          order_status: "pending",
        }),
      });
      const order = await res.json();

      /* if (!res.ok || !order.success) {
        throw new Error(order.error || "Order creation failed");
      } */

      if (!res.ok || !order.success) {
        throw {
          message: order.error || "Order failed",
          code: order.code,
        };
      }

      const orderId = order.orderId;

      // Initiate payment
      if (method === "paynl" || method === "paypal") {
        const payment = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: convertedTotals.total,
            customerEmail: formData.email,
            paymentMethod: method,
          }),
        });

        const data = await payment.json();

        if (!data.success) {
          throw {
            message: "Failed to initiate payment. Please try again.",
            code: "PAYMENT_FAILED",
          };
        }
        // Redirect user to payment gateway
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      // console.error("Checkout error:", err);

      setApiError(err.message || "Something went wrong");

      // 🔥 special handling
      if (err.code === "NO_STORE_AVAILABLE") {
        setApiError(
          "Some items are not available together. Try removing a few items.",
        );
      }

      if (err.code === "OUT_OF_STOCK") {
        setApiError(
          "One or more products are out of stock. Please update your cart.",
        );
      }

      if (err.code === "NO_NEARBY_STORES") {
        setApiError("We currently don’t deliver to your area.");
      }

      if (err.code === "MISSING_LOCATION") {
        setApiError("Please enter your full delivery address.");
      }

      if (err.code === "PAYMENT_FAILED") {
        setApiError("Failed to initiate payment. Please try again.");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      hide(); 
    }

    // catch (err: any) {
    //   console.error("Checkout error:", err);

    //   setApiError(err.message || "Something went wrong");

    //   // optional scroll to top
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    // }
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
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {apiError}
              </div>
            )}
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
              addresses={addresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
            <PaymentForm placeOrder={placeOrder} disabled={!isFormValid} />
          </div>
          {/* <OrderSummary items={cart} shippingMethod={shippingMethod} /> */}
          {/* {convertedTotals.total} === {convertedTotals.subtotal} ===={" "}
          {convertedTotals.tax} */}
          <OrderSummary
            items={cart}
            shippingMethod={shippingMethod}
            subtotal={convertedTotals.subtotal}
            tax={convertedTotals.tax}
            shipping={convertedTotals.shipping}
            total={convertedTotals.total}
          />
        </div>
      </div>
    </div>
  );
}
