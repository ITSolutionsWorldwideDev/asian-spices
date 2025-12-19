"use client";

import React, { useState } from "react";

const PriceFilter = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="mb-8 ">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="lg:hidden ml-2 w-full flex justify-between items-center px-2 py-1 border rounded-lg font-semibold text-gray-900 text-sm"
      >
        Price
        <span
          className={`transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Desktop Title */}
      <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-4">
        Price
      </h2>

      {/* Price Inputs */}
      <div
        className={`block items-center gap-3 mt-4 ${
          isMobileOpen ? "" : "hidden"
        } lg:flex` }
      >
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-2 w-20 py-2 border border-gray-300 rounded text-sm focus:ring-orange-500 focus:border-transparent"
        />

        <span className="text-gray-400">-</span>

        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-2 w-20 py-2 border border-gray-300 rounded text-sm focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
