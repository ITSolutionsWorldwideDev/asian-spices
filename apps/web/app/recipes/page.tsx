// apps/web/app/recipes/page.tsx

/* import Footer from "@/components/ui/Footer";
import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";

import {
  getBrands,
  getProducts,
  getSubcategories,
} from "@/lib/dbactions/products";

import FilterSidebar from "@/components/layout/products/FilterSidebar";
import InfiniteProducts from "@/components/layout/products/InfiniteProducts";
import SortDropdown from "@/components/layout/product_filter_search/SortDropdown";

interface PageProps {
  searchParams: Promise<{
    subcategories?: string;
    brands?: string;
    min?: string;
    max?: string;
    search?: string;
    page?: string;
  }>;
}

type Filters = {
  category: string;
  subcategories: string[];
  brands: string[];
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page: number;
};

export default async function RecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const cleanArray = (val?: string) => {
    if (!val) return [];

    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const filters: Filters = {
    category: "recipes",
    subcategories: cleanArray(params.subcategories),
    brands: cleanArray(params.brands),
    minPrice: params.min,
    maxPrice: params.max,
    search: params.search,
    page: Number(params.page || 1),
  };

  const subcategories = await getSubcategories("recipes");
  const brands = await getBrands();

  const products = await getProducts(filters);

  return (
    <div className="category-animation">

      <ProductPageHeader
        heading="A World of Recipes, One Pinch of Spice"
        text="Explore a diverse collection of recipes where every dish tells a flavorful story, from street‑style bites to homely classics, all elevated by the essence of spices."
        videoLink="/recipes/Comp 1_11.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="All the flavors now you finger tips "
        description="Diverse  Collection But Taste So Yummy...!"
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 container mx-auto p-5">
        <FilterSidebar subcategories={subcategories} brands={brands} />

        <div>
          <SortDropdown />

          <InfiniteProducts initialProducts={products} filters={filters} />
        </div>
      </div>

      <RegisterOnApp />
      <Reviews />
      <Footer />
    </div>
  );
} */

import ProductPageHeader from "@/components/ui/ProductPageHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";

import React from "react";
import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";
import ProductFilterSearch from "@/components/ui/ProductFilterSearch";
import ProductDisplay from "@/components/layout/recipes/ProductDisplay";
import Cart from "@/components/ui/Cart";

const RecipesPage = () => {
  const categoriesData = [
    {
      name: "Chicken Specialties",
      children: [
        "Chicken Biryani",
        "Chicken Cheese Pizza",
        "Chicken Karahi",
        "Butter Chicken",
        "Spicy Chicken Wings",
      ],
    },
    {
      name: "Indian Spices",
    },
    {
      name: "Chinese Spices",
    },

    { name: "Thai Spices" }, // No children
    { name: "Blend Spices" },
  ];

  const storesData = [
    { name: "alpha", children: ["fsadf", "dfa/sf", "fafads", "faf"] },
    { name: "Bvr Spices", children: ["fsadf", "dfa/sf", "fafads", "faf"] },
    "Neam Spices",
    "Thika Masala",
    "Too Spicy",
    "Aron Masalas",
    "Farm Special",
    "Zafrani Mehal",
    "Chili Fresh",
    "Good Spices",
  ];

  //
  return (
    <div>

      <ProductPageHeader
        heading="A World of Recipes, One Pinch of Spice"
        text="Explore a diverse collection of recipes where every dish tells a flavorful story, from street‑style bites to homely classics, all elevated by the essence of spices."
        videoLink="/recipes/Comp 1_11.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="All the flavors now you finger tips "
        description="Diverse  Collection But Taste So Yummy...!"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 container mx-auto p-5 items-start">
        {/* <ProductFilterSearch
          // categoriesData={categoriesData}
          storesData={storesData}
          title1={"Recipes By Items"}
          title2={"Recipes By Culture"}
        /> */}
        <ProductDisplay />
      </div>
      <RegisterOnApp />
      <Reviews />
      <Footer />
    </div>
  );
};

export default RecipesPage;
