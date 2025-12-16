"use client";

import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface Category {
  name: string;
  children?: string[];
}

interface CategoryDataProp {
  categoriesData: (string | Category)[];
  title1: string;
}   

const CategoryFilter = ({ categoriesData, title1 }: CategoryDataProp) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All Spices",
  ]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    if (category === "All Spices") {
      setSelectedCategories(["All Spices"]);
      setExpandedCategories([]);
    } else {
      const newCategories = selectedCategories.filter(
        (c) => c !== "All Spices"
      );
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter((c) => c !== category);
        setSelectedCategories(
          filtered.length === 0 ? ["All Spices"] : filtered
        );
        // Also collapse when unchecking
        setExpandedCategories(expandedCategories.filter((c) => c !== category));
      } else {
        setSelectedCategories([...newCategories, category]);
        // Auto-expand when checking a parent category
        const categoryObj = categoriesData.find(
          (cat) => typeof cat === "object" && cat.name === category
        ) as Category | undefined;
        if (categoryObj?.children && categoryObj.children.length > 0) {
          setExpandedCategories([...expandedCategories, category]);
        }
      }
    }
  };

  const handleChildToggle = (child: string) => {
    const newCategories = selectedCategories.filter((c) => c !== "All Spices");
    if (selectedCategories.includes(child)) {
      const filtered = newCategories.filter((c) => c !== child);
      setSelectedCategories(filtered.length === 0 ? ["All Spices"] : filtered);
    } else {
      setSelectedCategories([...newCategories, child]);
    }
  };

  const toggleExpand = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title1}</h2>
      <div className="space-y-2">
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
                <label className="flex items-center cursor-pointer group flex-1">
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
                    {categoryName}
                  </span>
                </label>

                {/* Expand/Collapse Icon */}
                {hasChildren && isSelected && (
                  <button
                    onClick={() => toggleExpand(categoryName)}
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

              {/* Child Categories */}
              {hasChildren && isSelected && isExpanded && (
                <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                  {category.children!.map((child) => (
                    <label
                      key={child}
                      className="flex items-center cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(child)}
                          onChange={() => handleChildToggle(child)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                            selectedCategories.includes(child)
                              ? "bg-black border-black"
                              : "border-gray-300 group-hover:border-gray-400"
                          }`}
                        >
                          {selectedCategories.includes(child) && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
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
                      <span className="ml-3 text-gray-500 text-sm group-hover:text-gray-900">
                        {child}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
