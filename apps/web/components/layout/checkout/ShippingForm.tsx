// apps/web/components/layout/checkout/ShippingForm.tsx

"use client";
import { useLoaderStore } from "@/store/useLoaderStore";
import { ChevronRight } from "lucide-react";

import { useEffect, useState } from "react";
interface Props {
  data: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  shippingMethod: "standard" | "express" | "overnight";
  setShippingMethod: (value: any) => void;
  errors: Record<string, string>;

  addresses: any[];
  selectedAddress: any;
  setSelectedAddress: (val: any) => void;
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
  addresses,
  selectedAddress,
  setSelectedAddress,
}: Props) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const { show, hide } = useLoaderStore();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        show("Loading Countries...");
        const res = await fetch("/api/countries");
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      } finally {
        hide();
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="  flex justify-center ">
      <div className="w-full  bg-white rounded-xl border border-[#E5E7EB] p-8">
        <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

        {addresses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Saved Addresses</h3>

            <div className="grid gap-4">
              {addresses.map((addr) => {
                const addressParts = [
                  addr.address_line1,
                  addr.address_line2,
                  addr.postal_code,
                  addr.city,
                  addr.state,
                  addr.country || "NL",
                ].filter(Boolean);
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);

                      setFormData((prev: any) => ({
                        ...prev,
                        firstName: addr.first_name || "",
                        lastName: addr.last_name || "",
                        address: addr.address_line1 || "",
                        appartment: addr.address_line2 || "",
                        city: addr.city || "",
                        state: addr.state || "",
                        zip: addr.postal_code || "",
                        country: addr.country || "NL",
                      }));
                    }}
                    className={`group relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      selectedAddress?.id === addr.id
                        ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    {selectedAddress?.id === addr.id && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">
                          ✓
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          selectedAddress?.id === addr.id
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      />

                      <p className="font-semibold text-gray-800 text-base">
                        {addr.label || "Address"}
                      </p>
                    </div>

                    {/* {(addr.first_name || addr.last_name) && (
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {[addr.first_name, addr.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                    )} */}

                    <p className="text-sm leading-6 text-gray-600">
                      {addressParts.join(", ")}
                    </p>

                    {/* <p className="font-medium">{addr.label}</p>
                  <p className="text-sm text-gray-600">
                    {addr.address_line1},{addr.city}, {addr.state}, {addr.country || "NL"}
                  </p> */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setSelectedAddress(null)}
          className="text-sm text-blue-500 underline mb-4"
        >
          Use a new address
        </button>

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
              value={data.appartment}
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
              <label className="block text-sm mb-1">State</label>
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
