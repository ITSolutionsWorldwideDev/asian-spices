"use client";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

interface ContactFormProps {
  setStep: (step: "contact" | "shipping" | "payment") => void;
}

type CheckoutData = {
  firstName: string;
  lastName: string;
  address: string;
  appartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};
export default function ShippingForm({ data, setFormData, setStep }: any) {
  const handleChange = (field: keyof CheckoutData, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [shippingMethod, setShippingMethod] = useState("standard");
  console.log(data);
  return (
    <div className="  flex justify-center ">
      <div className="w-full  bg-white rounded-xl shadow p-8">
        {/* ---------------- Shipping Address ---------------- */}
        <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

        <form className="space-y-5">
          {/* First & Last Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name *</label>
              <input
                type="text"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Last Name *</label>
              <input
                type="text"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-1">Address *</label>
            <input
              type="text"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          {/* Apartment */}
          <div>
            <label className="block text-sm mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.apartment}
              onChange={(e) => handleChange("appartment", e.target.value)}
            />
          </div>

          {/* City & State */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">City *</label>
              <input
                type="text"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">State *</label>
              <input
                type="text"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>
          </div>

          {/* ZIP & Country */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">ZIP Code *</label>
              <input
                type="text"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Country *</label>
              <select
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.country}
                onChange={(e) => handleChange("country", e.target.value)}
              >
                <option>Pakistan</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 text-[#E5E7EB]" />

          {/* ---------------- Shipping Method ---------------- */}
          <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>

          <div className="space-y-4">
            {/* Standard */}
            <label className="flex items-center justify-between border border-[#E5E7EB] rounded-xl p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={(e) => {
                    setShippingMethod(e.target.value);
                  }}
                />
                <div>
                  <p className="font-medium">Standard Shipping</p>
                  <p className="text-sm text-gray-500">5-7 business days</p>
                </div>
              </div>
              <span className="font-medium">$5.99</span>
            </label>

            {/* Express */}
            <label className="flex items-center justify-between border  border-[#E5E7EB] rounded-xl p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shippingMethod === "express"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div>
                  <p className="font-medium">Express Shipping</p>
                  <p className="text-sm text-gray-500">2-3 business days</p>
                </div>
              </div>
              <span className="font-medium">$12.99</span>
            </label>

            {/* Overnight */}
            <label className="flex items-center justify-between border border-[#E5E7EB] rounded-xl p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value="overnight"
                  checked={shippingMethod === "overnight"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <div>
                  <p className="font-medium">Overnight Shipping</p>
                  <p className="text-sm text-gray-500">Next business day</p>
                </div>
              </div>
              <span className="font-medium">$24.99</span>
            </label>
          </div>

          {/* ---------------- Buttons ---------------- */}
          <div className="flex flex-col sm:flex-row w-full mt-8 gap-4 sm:gap-8">
            <button
              // type="button"
              className="w-full px-6 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-100 transition"
              onClick={() => setStep("contact")}
            >
              Back
            </button>

            <button
              className="w-full px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center cursor-pointer transition"
              type="button"
              onClick={() => setStep("payment")}
            >
              Continue to Payment <ChevronRight className="size-[20]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
