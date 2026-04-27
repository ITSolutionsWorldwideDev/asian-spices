// apps/web/components/layout/products/FilterSidebar.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// 🔹 Collapsible wrapper
function Collapsible({ title, children }: any) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-6 border-b border-gray-400 pb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-semibold"
      >
        {title}
        <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

interface Props {
  subcategories: any[];
  brands: any[];
}

export default function FilterSidebar({ subcategories, brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================
  // 🔍 LOCAL STATE (UI only)
  // =========================
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  // =========================
  // ⚡ DEBOUNCED SEARCH
  // =========================
  useEffect(() => {
    const t = setTimeout(() => {
      updateSingle("search", search);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  // =========================
  // 🔧 HELPERS
  // =========================
  const getArray = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const updateUrl = (params: URLSearchParams) => {
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // single value update (search, min, max)
  const updateSingle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete(key);
    else params.set(key, value);

    updateUrl(params);
  };

  const updateMultiFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let current = getArray(key);

    if (current.includes(value)) {
      current = current.filter((v) => v !== value);
    } else {
      current.push(value);
    }

    if (current.length > 0) {
      params.set(key, current.join(","));
    } else {
      params.delete(key);
    }

    updateUrl(params);

    // params.set("page", "1");

    // router.push(`?${params.toString()}`);
  };

  const clearFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    updateUrl(params);
    // router.push(`?${params.toString()}`);
  };

  // =========================
  // SELECTED VALUES
  // =========================
  const selectedSub = getArray("subcategories");
  const selectedBrands = getArray("brands");

  return (
    <div className=" rounded-xl bg-white lg:shadow-xl p-5 shadow-sm">
      {/* border */}
      {/* =========================
          🔍 SEARCH (NEW)
      ========================= */}
      <Collapsible title="Search">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border p-2 rounded"
        />
      </Collapsible>

      {/* =========================
          💰 PRICE (NEW)
      ========================= */}
      <Collapsible title="Price">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => {
              setMin(e.target.value);
              updateSingle("min", e.target.value);
            }}
            className="w-1/2 border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => {
              setMax(e.target.value);
              updateSingle("max", e.target.value);
            }}
            className="w-1/2 border p-2 rounded"
          />
        </div>
      </Collapsible>

      {/* =========================
          📦 SUBCATEGORIES
      ========================= */}
      <Collapsible title="Categories">
        {subcategories.map((item) => {
          const checked = selectedSub.includes(item.id);

          return (
            <div key={item.id} className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group flex-1">
                {/* Hidden checkbox */}
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={item.product_count === 0}
                  onChange={() => updateMultiFilter("subcategories", item.id)}
                  className="sr-only"
                />

                {/* Custom checkbox UI */}
                <div className="relative">
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      checked
                        ? "bg-black border-black scale-100"
                        : "border-gray-300 group-hover:border-gray-400 scale-95"
                    }`}
                  >
                    {checked && (
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

                {/* Label */}
                <span className="ml-3 text-gray-600 text-sm group-hover:text-gray-900">
                  {item.name}
                  {item.product_count && (
                    <span className="ml-1 text-gray-400">
                      ({item.product_count})
                    </span>
                  )}
                </span>
              </label>
            </div>
          );
        })}

        <button
          onClick={() => clearFilter("subcategories")}
          className="text-xs text-orange-500 mt-2 cursor-pointer"
        >
          Clear
        </button>
      </Collapsible>

      {/* =========================
          🏷️ BRANDS
      ========================= */}
      <Collapsible title="Brands">
        {brands.map((brand) => {
          const checked = selectedBrands.includes(brand.brand_id);

          return (
            <div
              key={brand.brand_id}
              className="flex items-center justify-between"
            >
              <label className="flex items-center cursor-pointer group flex-1">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={brand.product_count === 0}
                  onChange={() => updateMultiFilter("brands", brand.brand_id)}
                  className="sr-only"
                />

                <div className="relative">
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      checked
                        ? "bg-black border-black scale-100"
                        : "border-gray-300 group-hover:border-gray-400 scale-95"
                    }`}
                  >
                    {checked && (
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
                  {brand.name}
                  {brand.product_count && (
                    <span className="ml-1 text-gray-400">
                      ({brand.product_count})
                    </span>
                  )}
                </span>
              </label>
            </div>
          );
        })}

        <button
          onClick={() => clearFilter("brands")}
          className="text-xs text-orange-500 mt-2 cursor-pointer"
        >
          Clear
        </button>
      </Collapsible>
    </div>
  );
}

/* {subcategories.map((item) => {
          const checked = selectedSub.includes(item.id);

          return (
            <label
              key={item.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-5 h-5 border-2 rounded flex items-center justify-center transition-colors bg-black border-black"
                checked={checked}
                onChange={() =>
                  updateMultiFilter("subcategories", item.id)
                }
              />
              <span className="text-sm">
                {item.name}{" "}
                {item.product_count && `(${item.product_count})`}
              </span>
            </label>
          );
        })} 
          
        
        {brands.map((brand) => {
          const checked = selectedBrands.includes(brand.brand_id);

          return (
            <label
              key={brand.brand_id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => updateMultiFilter("brands", brand.brand_id)}
              />
              <span className="text-sm">
                {brand.name} {brand.product_count && `(${brand.product_count})`}
              </span>
            </label>
          );
        })}
        */
/* "use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1"); // reset pagination

    router.push(`/spices?${params.toString()}`);
  };

  return (
    <div>
      <h2>Categories</h2>

      <button onClick={() => updateFilter("subcategories", "uuid1")}>
        Chili Powder
      </button>

      <h2>Brands</h2>

      <button onClick={() => updateFilter("brands", "uuid2")}>
        Shan Foods
      </button>
    </div>
  );
} */
