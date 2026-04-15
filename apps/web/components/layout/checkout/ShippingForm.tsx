// apps/web/components/layout/checkout/ShippingForm.tsx

"use client";
import { ChevronRight } from "lucide-react";

import { useEffect, useState } from "react";
interface Props {
  data: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  shippingMethod: "standard" | "express" | "overnight";
  setShippingMethod: (value: any) => void;
  errors: Record<string, string>;
}

type Country = {
  id: number;
  name: string;
  iso2: string;
};

export default function ShippingForm({
  data,
  setFormData,
  shippingMethod,
  setShippingMethod,
  errors,
}: Props) {

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="  flex justify-center ">
      <div className="w-full  bg-white rounded-xl border border-[#E5E7EB] p-8">
        <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                First Name<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                Last Name<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Address<span className="text-red-700 ms-1">*</span>
            </label>
            <input
              type="text"
              name="address"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.apartment}
              onChange={(e) => handleChange("appartment", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                City<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="city"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                ZIP Code<span className="text-red-700 ms-1">*</span>
              </label>
              <input
                type="text"
                name="zip"
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
              {errors.zip && (
                <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                Country<span className="text-red-700 ms-1">*</span>
              </label>

              {countries.length === 0 ? (
                <p className="text-sm text-gray-400">Loading countries...</p>
              ) : (
                <select
                  name="country"
                  className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={data.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                >
                  <option value="">Select country</option>

                  {countries.map((c) => (
                    <option key={c.id} value={c.iso2}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-6 text-[#E5E7EB]" />

        <h2 className="text-xl font-semibold mb-4">Delivery</h2>

        <div className="space-y-4">
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
      </div>
    </div>
  );
}
