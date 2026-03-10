"use client";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Volume2,
} from "lucide-react";



export default function BusinessVerification({
  formData,
  setFormData,
  activeStep,
  setActiveStep,
}: any) {
  

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(formData);
  return (
    <div>
      <div className=" bg-gray-100 flex items-start justify-center pt-10 px-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full  p-8">
          {/* Header */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Company Registration
          </h1>
          <p className="text-gray-500 text-sm mb-3">
            Search for your company using either the company name or Chamber of
            Commerce number.
          </p>

          {/* Read aloud */}
          <button className="flex items-center gap-1.5 text-blue-600 text-sm mb-6 hover:underline">
            <Volume2 size={16} />
            Read aloud
          </button>

        

          {/* Search Field */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {/* {activeTab === "name" ? "Company Name" :  */}
            KVK Number
            {/* // } */}
          </label>
          <div className="flex gap-3 mb-6">
            
         
            <input
              // type="text"
              // value={formData.kvkNumber}
              onChange={(e) => handleChange("kvk_number", e.target.value)}
              // onKeyDown={handleKeyDown}
              placeholder="12345678"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
            />
          </div>
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
                // value={formData.companyName}
                onChange={(e) => handleChange("company_name", e.target.value)}
                // value=""
              />
              <InputField
                label="Chamber of Commerce Number"
                // value={formData.ChamberOfCommerceNumber}
                onChange={(e) =>
                  handleChange("chamber_of_commerce_number", e.target.value)
                }
                // value="12345678"
              />
              <InputField
                label="Country"
                // value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
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
                // value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="House Number"
                  // value={formData.houseNumber}
                  onChange={(e) => handleChange("house_number", e.target.value)}
                />


             
         
                <InputField
                  label="Addition (Optional)"
                  // value={formData.Addition}
                  onChange={(e) => handleChange("additional_address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Postal Code"
                  // value={formData.postalCode}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                />
                <InputField
                  label="City"
                  // value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
            </div>
          </div>
         
         
          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              onClick={() => setActiveStep(activeStep + 1)}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* Reusable Input Component */ function InputField({
  label,
  onChange,

  // value,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // value: string;
}) {
  return (
    <div>
      {" "}
      <label className="block text-sm text-gray-600 mb-1">{label}</label>{" "}
      <input
        type="text"
        // value={value}
        onChange={onChange}
        className="w-full bg-gray-100  rounded-md px-3 py-2 text-gray-700"
      />{" "}
    </div>
  );
}
