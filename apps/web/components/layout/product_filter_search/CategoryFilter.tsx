"use client";

import React, { useState } from "react";

interface Category {
  name: string;
  children?: string[];
}

interface CategoryDataProp {
  categoriesData: (string | Category)[];
  title1: string;
}

const CategoryFilter = ({ categoriesData, title1 }: CategoryDataProp) => {
  // 🔹 Safely resolve first category

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const toggleExpand = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const firstItem = categoriesData[0];

  const firstCategory =
    firstItem && typeof firstItem === "object"
      ? firstItem.name
      : typeof firstItem === "string"
        ? firstItem
        : "";

  const firstCategoryHasChildren =
    firstItem &&
    typeof firstItem === "object" &&
    firstItem.children &&
    firstItem.children.length > 0;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    firstCategory ? [firstCategory] : []
  );

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    firstCategory && firstCategoryHasChildren ? [firstCategory] : []
  );

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      // ✅ Allow full unselect
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);

      // Auto-expand if parent has children
      const categoryObj = categoriesData.find(
        (cat) => typeof cat === "object" && cat.name === category
      ) as Category | undefined;

      if (categoryObj?.children?.length) {
        setExpandedCategories([...expandedCategories, category]);
      }
    }
  };

  return (
    <>
      <div className="mb-8">
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleMobile}
          className="lg:hidden  text-sm w-full flex justify-between items-center px-2 py-1 border rounded-lg text-gray-900 font-semibold"
        >
          {title1}
          <span
            className={`transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {/* Title for Desktop */}
        <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-4">
          {title1}
        </h2>

        {/* Category List */}
        <div
          className={`space-y-2 mt-4 lg:mt-0 ${
            isMobileOpen ? "block" : "hidden"
          } lg:block`}
        >
          {categoriesData.map((category) => {
            const isObject = typeof category === "object";
            const categoryName = isObject ? category.name : category;
            const hasChildren =
              isObject && category.children && category.children.length > 0;
            const isExpanded = expandedCategories.includes(categoryName);
            const isSelected = selectedCategories.includes(categoryName);

            return (
              <div key={categoryName}>
                {/* Parent Category */}
                <div className="flex items-center justify-between">
                  <label
                    className="flex items-center cursor-pointer group flex-1"
                    onClick={() => hasChildren && toggleExpand(categoryName)}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(categoryName)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-black"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <span className="ml-3 text-gray-600 text-sm group-hover:text-gray-900">
                      {categoryName}
                    </span>
                  </label>

                  {/* Expand icon (mobile only) */}
                  {hasChildren && (
                    <span className="lg:hidden text-xs">
                      {isExpanded ? "−" : "+"}
                    </span>
                  )}
                </div>

                {/* Child Categories */}
                {hasChildren && isExpanded && (
                  <div className="ml-8 mt-2 space-y-2">
                    {category.children!.map((child) => (
                      <div key={child} className="text-gray-500 text-sm">
                        {child}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
