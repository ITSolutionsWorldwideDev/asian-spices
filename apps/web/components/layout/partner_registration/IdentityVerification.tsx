"use client";

import { useState } from "react";
import ReadAloudBtn from "./ReadAloudBtn";

const banks = [
  "ABN AMRO",
  "ING",
  "Rabobank",
  "SNS Bank",
  "ASN Bank",
  "RegioBank",
  "Triodos Bank",
  "Knab",
];

export default function IdentityVerification({
  activeStep,
  setActiveStep,
  formData,
}: any) {
  const handleSubmit = async () => {
    setActiveStep(activeStep + 1);

    try {
      const response = await fetch("/api/partner-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to submit partner registration Form Please try again and fill all the required fields",
        );
      }
      if (response.ok) {
        alert("Partner registration submitted successfully!");
        setActiveStep(activeStep + 1);
      }
    } catch (error) {
      console.error("Error submitting partner registration:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen bg-gray-100 flex justify-center p-6"
      id="identity-verification"
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Identity Verification (iDIN)
          </h1>
          <p className="text-gray-500 mt-2">
            Verify your identity securely through your bank using iDIN.
          </p>
          <p className="text-blue-500 text-sm mt-2 cursor-pointer">
            <ReadAloudBtn ID={"identity-verification"} />
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg text-sm">
          <p className="font-semibold">What is iDIN?</p>
          <p className="mt-1">
            iDIN is a secure identification tool provided by Dutch banks. It
            allows you to verify your identity without sharing financial data or
            bank balances. This verification helps us prevent fraud and confirm
            that you have the legal authority to register this business.
          </p>
        </div>

        {/* Bank Selection */}
        <div>
          <p className="font-medium text-gray-700 mb-4">
            Select your bank <span className="text-red-500">*</span>
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {banks.map((bank) => (
              <button
                key={bank}
                type="button" // ✅ prevent form submission
                onClick={() => setSelectedBank(bank)} // ✅ enable selection
                className={`border rounded-xl p-4 text-left transition hover:border-gray-400 ${
                  selectedBank === bank
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                {bank}
              </button>
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <div>
          <button
            disabled={!selectedBank}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              selectedBank
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            🛡 Verify with iDIN
          </button>

          <p className="text-xs text-gray-400 text-center mt-2">
            You will be redirected to your bank's secure environment
          </p>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">
            Your Privacy & Security:
          </h2>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ No financial data or account balances are shared</li>
            <li>✔ Only your legal name and identity are verified</li>
            <li>✔ Secure connection directly with your bank</li>
            <li>✔ GDPR compliant identity verification</li>
          </ul>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-between">
          <button
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            ← Back
          </button>

          <button
            disabled={!selectedBank}
            className={`px-6 py-2 rounded-lg text-white transition ${
              selectedBank
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
          >
            Submit Partner Registration →
          </button>
        </div>
      </div>
    </div>
  );
}
