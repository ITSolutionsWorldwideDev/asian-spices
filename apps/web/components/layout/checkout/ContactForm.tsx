import { ChevronRight } from "lucide-react";
interface ContactFormProps {
  setStep: (step: "contact" | "shipping" | "payment") => void;
}
export default function ContactForm({ setStep }: ContactFormProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
      <h2 className="font-semibold mb-6">Contact Information</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email Address *</label>
          <input
            className="w-full mt-1 rounded-lg bg-gray-100 px-4 py-3 outline-none"
            placeholder="Email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone Number *</label>
          <input
            className="w-full mt-1 rounded-lg bg-gray-100 px-4 py-3 outline-none"
            placeholder="Phone"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="accent-orange-500" />
          Email me with news and offers
        </label>

        <button
          className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-medium flex items-center justify-center"
          type="button"
          onClick={() => setStep("shipping")}
        >
          Continue to Shipping <ChevronRight />
        </button>
      </div>
    </div>
  );
}
