import React from "react";
import CategoryFilter from "../layout/product_filter_search/CategoryFilter";
import StoreFilter from "../layout/product_filter_search/StoreFilter";
import PriceFilter from "../layout/product_filter_search/PriceFilter";

// interface Category {
//   name: string;
//   children?: string[];
// }

interface Stores {
  name: string;
  children?: string[];
}
interface ProductFilterSearchProps {
  // categoriesData: (string | Category)[];
  storesData: (string | Stores)[];
  title1: string;
  title2: string;
}

export default function ProductFilterSearch({
  storesData,
  title1,
  title2,
}: ProductFilterSearchProps) {
  return (
    <div className=" mx-auto  lg:shadow-xl p-5">
      <div className=" rounded-lg flex justify-center lg:block  space-x-5">
        {/* Spices Category Section */}

        <CategoryFilter  title1={title1} />
        {/* Stores Section */}
        <StoreFilter storesData={storesData} title2={title2} />

        {/* Price Section */}
        <PriceFilter />
        <button
          // onClick={handleSearch}
          className="hidden lg:block  w-full bg-amber-400 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      <button
        // onClick={handleSearch}
        className="lg:hidden w-full bg-amber-400 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
      >
        Search
      </button>
    </div>
  );
}
