// apps/web/components/layout/partner_registration/BusinessVerification.tsx

"use client";
import { ArrowLeft, ArrowRight, Building2, MapPin } from "lucide-react";

import ReadAloudBtn from "./ReadAloudBtn";
import { z } from "zod";
import { useState } from "react";
export default function BusinessVerification({
  formData,
  setFormData,
  activeStep,
  setActiveStep,
  setCompletedSteps,
}: any) {
  const businessSchema = z.object({
    kvk_number: z
      .string()
      .min(1, "KVK number is required")
      .regex(/^[0-9]+$/, "KVK must be numeric"),
    company_name: z.string().min(1, "Company name is required"),
    chamber_of_commerce_number: z.string().min(1, "Chamber number is required"),
    country: z.string().min(1, "Country is required"),
    street: z.string().min(1, "Street is required"),
    house_number: z.string().min(1, "House number is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    city: z.string().min(1, "City is required"),
    additional_address: z.string().optional(),
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  return (
    <div id="business-verification">
      <div className="bg-gray-100 flex items-start justify-center pt-10 px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full  p-6 sm:p-8">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
            Company Registration
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-3">
            Search for your company using either the company name or Chamber of
            Commerce number.
          </p>

          {/* Read aloud */}
          <ReadAloudBtn ID={"business-verification"} />

          {/* Search Field */}
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {/* KVK Number */}Chamber of Commerce Number.
          </label>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ];
              }}
              onChange={(e) => {
                handleChange("kvk_number", e.target.value);
              }}
              value={formData.kvk_number || ""}
              placeholder="12345678"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm "
              required
            />
          </div>
          {/* ✅ Error */}
          {errors.kvk_number && (
            <p className="text-red-500 text-xs mt-1">
              field is required Please Enter a valid input
            </p>
          )}
        </div>
      </div>

      <div className=" bg-gray-100 flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">
            Business & Billing Verification
          </h1>
          <p className="text-gray-500 mt-2">
            Please review your company information retrieved from the Chamber of
            Commerce.
          </p>
          {/* Billing Address Notice */}
          <div className="mt-6 bg-[#FFF2E3] border border-orange-200 text-orange-600 p-4 rounded-lg">
            <p className="font-medium">Billing Address Notice</p>
            <p className="text-sm mt-1 text-[#FF6900]">
              The official Chamber of Commerce-registered address shown below
              will be used as your primary billing address. If you need to
              modify any information, please go back and search for the correct
              company.
            </p>
          </div>
          {/* Company Details */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-700">Company Details</h2>
            </div>
            <div className="space-y-4">
              <InputField
                label="Company Name"
                value={formData.company_name || ""}
                // value={formData.companyName}
                onChange={(e) => {
                  handleChange("company_name", e.target.value);
                }}
                error={errors.company_name?.[0]}

                // value=""
              />
              <InputField
                label="Chamber of Commerce Number"
                value={formData.chamber_of_commerce_number || ""}
                // value={formData.ChamberOfCommerceNumber}
                onChange={(e) =>
                  handleChange("chamber_of_commerce_number", e.target.value)
                }
                error={errors.chamber_of_commerce_number?.[0]}

                // value="12345678"
              />
              <InputField
                label="Country"
                value={formData.country || ""}
                // value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                error={errors.country?.[0]}
              />
            </div>
          </div>
          {/* Registered Address */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-700">
                Registered Address
              </h2>
            </div>
            <div className="space-y-4">
              <InputField
                label="Street"
                value={formData.street || ""}
                // value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
                error={errors.street?.[0]}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="House Number"
                  value={formData.house_number || ""}
                  // value={formData.houseNumber}
                  onChange={(e) => handleChange("house_number", e.target.value)}
                  error={errors.house_number?.[0]}
                />

                <InputField
                  label="Addition (Optional)"
                  value={formData.additional_address || ""}
                  // value={formData.Addition}
                  onChange={(e) =>
                    handleChange("additional_address", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Postal Code"
                  value={formData.postal_code || ""}
                  // value={formData.postalCode}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  error={errors.postal_code?.[0]}
                />
                <InputField
                  label="City"
                  value={formData.city || ""}
                  // value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  error={errors.city?.[0]}
                />
              </div>
            </div>
          </div>

          <div className=" mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
            <div className=" rounded-lg  text-sm text-gray-600 space-y-2">
              <h2 className="font-semibold text-gray-800">Need Help?</h2>
              <p>
                If you have any questions about your registration or need
                assistance, our support team is here to help.
              </p>

              <div className="flex flex-wrap gap-4 text-orange-600">
                <span>✉ partners@asianspices.com</span>
                <span>📄 Registration FAQ</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
              type="button"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 w-full sm:w-auto"
              type="button"
              onClick={() => {
                const result = businessSchema.safeParse(formData);

                if (!result.success) {
                  const fieldErrors = result.error.flatten().fieldErrors;
                  setErrors(fieldErrors);
                  return;
                }

                // ✅ mark step 2 complete
                setCompletedSteps((prev: number[]) => [
                  ...new Set([...prev, activeStep]),
                ]);

                setActiveStep(activeStep + 1);
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  onChange,
  value,
  error,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error?: string;
}) {
  return (
    <div>
      {" "}
      <label className="block text-sm text-gray-600 mb-1">{label}</label>{" "}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full bg-gray-100  rounded-md px-3 py-2 text-gray-700"
      />{" "}
      {/* ✅ Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          please Enter a valid Input required field
        </p>
      )}
    </div>
  );
}
