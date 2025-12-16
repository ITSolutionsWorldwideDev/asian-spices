"use client";

import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface Store {
  name: string;
  children?: string[];
}

interface StoreDataProp {
  storesData: (string | Store)[];
  title2: string;
}

const StoreFilter = ({ storesData, title2 }: StoreDataProp) => {
  const [selectedStores, setSelectedStores] = useState<string[]>(["Bvr Spices"]);
  const [expandedStores, setExpandedStores] = useState<string[]>([]);
  const [showAllStores, setShowAllStores] = useState(false);

  const handleStoreToggle = (store: string) => {
    if (selectedStores.includes(store)) {
      const filtered = selectedStores.filter((s) => s !== store);
      setSelectedStores(filtered.length === 0 ? [store] : filtered);
      // Collapse when unchecking
      setExpandedStores(expandedStores.filter((s) => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
      // Auto-expand when checking if it has children
      const storeObj = storesData.find(
        (st) => typeof st === "object" && st.name === store
      ) as Store | undefined;
      if (storeObj?.children && storeObj.children.length > 0) {
        setExpandedStores([...expandedStores, store]);
      }
    }
  };

  const toggleExpand = (store: string) => {
    if (expandedStores.includes(store)) {
      setExpandedStores(expandedStores.filter((s) => s !== store));
    } else {
      setExpandedStores([...expandedStores, store]);
    }
  };

  const visibleStores = showAllStores ? storesData : storesData.slice(0, 8);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title2}</h2>
      <div className="space-y-2">
        {visibleStores.map((store) => {
          const isObject = typeof store === "object";
          const storeName = isObject ? store.name : store;
          const hasChildren = isObject && store.children && store.children.length > 0;
          const isExpanded = expandedStores.includes(storeName);
          const isSelected = selectedStores.includes(storeName);

          return (
            <div key={storeName}>
              {/* Parent Store */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleStoreToggle(storeName)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-black border-black"
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}
                    >
                      {isSelected && (
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
                    {storeName}
                  </span>
                </label>

                {/* Expand/Collapse Icon - only show when checked and has children */}
                {hasChildren && isSelected && (
                  <button
                    onClick={() => toggleExpand(storeName)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <IoChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <IoChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                )}
              </div>

              {/* Child Stores - No checkboxes, just display */}
              {hasChildren && isSelected && isExpanded && (
                <div className="ml-8 mt-2 space-y-1.5 border-l-2 border-gray-200 pl-4">
                  {store.children!.map((child) => (
                    <div
                      key={child}
                      className="flex items-center text-gray-500 text-sm py-1"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                      <span>{child}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {storesData.length > 8 && (
        <button
          onClick={() => setShowAllStores(!showAllStores)}
          className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600"
        >
          {showAllStores ? "View less" : `View more (${storesData.length - 8} more)`}
        </button>
      )}
    </div>
  );
};

export default StoreFilter;