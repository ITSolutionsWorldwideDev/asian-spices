"use client";
import React, { useState } from "react";
interface SpiceFilterSearchProps {
  categoriesData: string[];
  storesData: string[];
}

export default function SpiceFilterSearch({
  categoriesData,
  storesData,
}: SpiceFilterSearchProps) {
  const [selectedCategories, setSelectedCategories] = useState(["All Spices"]);
  const [selectedStores, setSelectedStores] = useState(["Bvr Spices"]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAllStores, setShowAllStores] = useState(false);

  const handleCategoryToggle = (category: any) => {
    if (category === "All Spices") {
      setSelectedCategories(["All Spices"]);
    } else {
      const newCategories = selectedCategories.filter(
        (c) => c !== "All Spices"
      );
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter((c) => c !== category);
        setSelectedCategories(
          filtered.length === 0 ? ["All Spices"] : filtered
        );
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  const handleStoreToggle = (store: any) => {
    if (selectedStores.includes(store)) {
      const filtered = selectedStores.filter((s) => s !== store);
      setSelectedStores(filtered.length === 0 ? [store] : filtered);
    } else {
      setSelectedStores([...selectedStores, store]);
    }
  };

  const handleSearch = () => {
    console.log({
      categories: selectedCategories,
      stores: selectedStores,
      priceRange: { min: minPrice, max: maxPrice },
    });
    // Add your search logic here
  };

  const visibleStores = showAllStores ? storesData : storesData.slice(0, 9);

  return (
    <div className="max-w-sm mx-auto  shadow-xl p-5">
      <div className=" rounded-lg shadow-sm ">
        {/* Spices Category Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Spices Category
          </h2>
          <div className="space-y-3">
            {categoriesData.map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      selectedCategories.includes(category)
                        ? "bg-black border-black"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {selectedCategories.includes(category) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-gray-600 text-sm group-hover:text-gray-900">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Stores Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stores</h2>
          <div className="space-y-3">
            {visibleStores.map((store) => (
              <label
                key={store}
                className="flex items-center cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedStores.includes(store)}
                    onChange={() => handleStoreToggle(store)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      selectedStores.includes(store)
                        ? "bg-black border-black"
                        : "border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {selectedStores.includes(store) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-gray-600 text-sm group-hover:text-gray-900">
                  {store}
                </span>
              </label>
            ))}
          </div>
          {storesData.length > 9 && (
            <button
              onClick={() => setShowAllStores(!showAllStores)}
              className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600"
            >
              {showAllStores ? "View less" : "View more"}
            </button>
          )}
        </div>

        {/* Price Section */}
        <div className="overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 ">Price</h2>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 w-25 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 w-25 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
