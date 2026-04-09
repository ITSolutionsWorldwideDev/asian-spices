// apps/web/components/layout/checkout/ShippingForm.tsx

"use client";
import { ChevronRight } from "lucide-react";

import { useEffect, useState } from "react";
interface Props {
  data: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
}

type Country = {
  id: number;
  name: string;
  iso2: string;
};

export default function ShippingForm({ data, setFormData, errors }: Props) {
  const [shippingMethod, setShippingMethod] = useState("standard");

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
                State<span className="text-red-700 ms-1">*</span>
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

            {/* <div>
              <label className="block text-sm mb-1">
                Country<span className="text-red-700 ms-1">*</span>
              </label>
              <select
                className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data.country}
                name="country"
                onChange={(e) => handleChange("country", e.target.value)}
              >
                <option>Pakistan</option>
                <option>USA</option>
                <option>UK</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div> */}
          </div>
        </div>

        <hr className="my-6 text-[#E5E7EB]" />

        <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>

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
/* "use client";
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
      
        <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

        <form className="space-y-5">
     
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


          <div>
            <label className="block text-sm mb-1">Address *</label>
            <input
              type="text"
              className="w-full bg-[#F3F3F5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

        
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


          <hr className="my-6 text-[#E5E7EB]" />


          <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>

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
} */
