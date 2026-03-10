"use client";

import { useState } from "react";

export default function ContactDetails({
  formData,
  setFormData,
  activeStep,
  setActiveStep,
}: any) {
  const [agree, setAgree] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  console.log(formData);
  return (
    <div className=" bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Contact, Billing & Legal Confirmation
          </h1>
          <p className="text-gray-500 mt-2">
            Provide your contact details, tax information, and legal
            confirmations.
          </p>
          <p className="text-blue-500 text-sm mt-2 cursor-pointer">
            🔊 Read aloud
          </p>
        </div>

        {/* Your Details */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-6">
          <h2 className="font-semibold text-gray-800">Your Details</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                // value={formData.Fname}
                onChange={(e) => handleChange(" first_name", e.target.value)}
                placeholder="Sheetal"
                className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Middle Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Optional"
                // value={formData.Mname}
                onChange={(e) => handleChange("middle_name", e.target.value)}
                className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Devi"
                // value={formData.Lname}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Business Contact Details */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-6">
          <h2 className="font-semibold text-gray-800">
            Business Contact Details
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Business Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              // value={formData.BusinessPhoneNumber}
              onChange={(e) =>
                handleChange("business_phone_number", e.target.value)
              }
              placeholder="+31 6 12345678"
              className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Business Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              // value={formData.BusinessEmailAddress}
              onChange={(e) =>
                handleChange("business_email_address", e.target.value)
              }
              placeholder="info@company.com"
              className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-500 mt-2">
              My billing email is the same as my business email
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              VAT Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="NL123456789B01"
              // value={formData.VatNumber}
              onChange={(e) => handleChange("vat_number", e.target.value)}
              className="w-full mt-1 border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-2">
              Format: Country code + numbers (e.g., NL123456789B01)
            </p>
          </div>
        </div>

        {/* Business Delivery Settings */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">
            Business Delivery Settings
          </h2>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Select delivery countries <span className="text-red-500">*</span>
            </p>

            <div className="mt-3 space-y-2 text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Netherlands
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Belgium
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Luxembourg
              </label>
            </div>
          </div>
        </div> */}

        {/* Legal Confirmation */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Legal Confirmation</h2>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 accent-orange-500"
            />
            <span>
              I agree to the{" "}
              <span className="text-orange-500 underline cursor-pointer">
                General Terms and Conditions
              </span>{" "}
              and the{" "}
              <span className="text-orange-500 underline cursor-pointer">
                Privacy Statement
              </span>
              . <span className="text-red-500">*</span>
            </span>
          </label>

          <p className="text-xs text-gray-500">
            By completing your registration, you confirm that you have the legal
            authority to act on behalf of this business or have obtained
            explicit consent to do so. Furthermore, you agree to our General
            Terms and Conditions and authorize the processing of your data as
            outlined in our Privacy Statement.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            ← Back
          </button>

          <button
            disabled={!agree}
            className={`px-6 py-2 rounded-lg text-white transition ${
              agree
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() => setActiveStep(activeStep + 1)}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
