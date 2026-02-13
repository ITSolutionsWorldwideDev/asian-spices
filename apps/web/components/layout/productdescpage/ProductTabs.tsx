"use client";

import { useState } from "react";
import ReviewsSection from "../tetimonials/ReviewsSection";

const tabs = [
  "Description",
  "Nutrition Info",
  "How to Use",
  "Reviews (234)",
] as const;

type Tab = (typeof tabs)[number];

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Description");

  return (
    <div className=" container mx-auto p-6 bg-gray-50">
      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 gap-1 w-full overflow-x-auto sm:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer shrink-0 sm:flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap
        ${
          activeTab === tab
            ? "bg-white text-black shadow"
            : "text-gray-500 hover:text-black"
        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 text-gray-700 text-sm leading-relaxed">
        {activeTab === "Description" && (
          <>
            <p className="text-[#364153] ">
              Our Premium Saffron Threads are sourced from the pristine fields
              of Kashmir, known worldwide for producing the finest quality
              saffron. Each thread is carefully hand-picked during the brief
              harvesting season to ensure maximum potency and flavor. This Grade
              A saffron delivers an intense aroma, vibrant golden color, and
              authentic taste that elevates any dish.
            </p>

            <h4 className="mt-6  text-black">Product Details</h4>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="SKU" value="SAF-KAS-001" />
              <Detail label="Weight" value="5g" />
              <Detail label="Category" value="Premium" />
              <Detail label="Origin" value="Kashmir, India" />
            </div>
          </>
        )}

        {activeTab === "Nutrition Info" && (
          <>
            <h1 className="mb-5 font-bold text-xl">Nutritional Information</h1>
            <div className=" w-[50%] border border-gray-200 rounded-lg">
              <InfoRow label="Serving Size" value="0.5g (approx. 15 threads)" />
              <InfoRow label="Calories" value="2" />
              <InfoRow label="Protein" value="0.1g" />
              <InfoRow label="Fat" value="6g" />
              <InfoRow label="Carbohydrates" value="0.3g" />
            </div>
          </>
        )}

        {activeTab === "How to Use" && (
          <section className="max-w-3xl px-6 py-10 text-gray-700">
            {/* How to Use */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How to Use
              </h2>
              <p className="leading-relaxed text-gray-600">
                Soak 10–15 threads in 2 tablespoons of warm milk or water for
                15–20 minutes before use. Add the saffron-infused liquid to your
                dish for best results. Use in rice dishes, desserts, beverages,
                and meat preparations.
              </p>
            </div>

            {/* Storage Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Storage Instructions
              </h2>
              <p className="leading-relaxed text-gray-600">
                Store in an airtight container in a cool, dry place away from
                direct sunlight. Properly stored saffron can last up to 2 years.
              </p>
            </div>
          </section>
        )}

        {activeTab === "Reviews (234)" && (
          <div className="space-y-4">
            <ReviewsSection />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="container mx-auto flex justify-between bg-white px-4 py-3 rounded-lg">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-300 p-2 ">
      <span className="text-[#364153]">{label}</span>
      <span className="text-black">{value}</span>
    </div>
  );
}
