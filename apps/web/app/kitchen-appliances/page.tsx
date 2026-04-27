// apps/web/app/kitchen-appliances/page.tsx

import Footer from "@/components/ui/Footer";
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

export default async function KitchenAppliancesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const cleanArray = (val?: string) => {
    if (!val) return [];

    return val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && v !== "null" && v !== "undefined");
  };

  const filters: Filters = {
    category: "kitchen-appliances",
    subcategories: cleanArray(params.subcategories),
    brands: cleanArray(params.brands),
    minPrice: params.min,
    maxPrice: params.max,
    search: params.search,
    page: Number(params.page || 1),
  };

  const subcategories = await getSubcategories("kitchen-appliances");
  const brands = await getBrands();

  const products = await getProducts(filters);

  return (
    <div className="category-animation">

      <ProductPageHeader
        heading="Cook with Confidence, Live with Ease"
        text="From ovens to blenders, our appliances combine durability, style, and innovation to make everyday meals extraordinary."
        videoLink="/kitchens/Comp 1_9.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Kitchen Appliances"
        description="Discover authentic quality appliances from across Asia"
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
}


/* import HeadingDescription from "@/components/ui/HeadingDescription";
import ProductPageHeader from "@/components/ui/ProductPageHeader";
import ProductFilterSearch from "@/components/ui/ProductFilterSearch";
import ProductCard from "@/components/ui/ProductCard";
import React from "react";
import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";

const KitchenAppliancesPage = () => {
  const products = [
    {
      id: 1,
      title: "Organic Turmeric Powder",
      image: "8a94a27bd306859ae9b600c037a4132590040eeb.jpg",
      price: 12.99,
      oldPrice: 16.99,
      tag: "Best Seller",
      off: "43% OFF",
      rating: 5,
      reviews: 324,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich fdsajfk jfsakdjf kfjdsnfljasdnf fasdjfnlasdjf `,
      weight: "5g",
    },
    {
      id: 2,
      title: "Kashmiri Red Chili",
      image: "4caf9d6641bf36d533305c3780224db74f2fcb10.jpg",
      price: 9.99,
      oldPrice: 18.99,
      tag: "premium",
      off: "45% OFF",
      rating: 5,
      reviews: 256,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },
    {
      id: 3,
      title: "Green Cardamom Pods",
      image: "d0d71ccc77225c5632c6a8252e49efd239f36128.jpg",
      price: 18.99,
      oldPrice: null,
      tag: "Premium",
      off: "",
      rating: 5,
      reviews: 412,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },
    {
      id: 4,
      title: "Whole Cumin Seeds",
      image: "f0628e7f24dc881ed02eabe0e8baad05fe12cecf.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "best seller",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 5,
      title: "Whole Cumin Seeds",
      image: "268598abe4d4ba567742332ae571b20ea98ce9d9.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "best seller",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 6,
      title: "Whole Cumin Seeds",
      image: "00d83a5cfaaef67b8a9dc507414d03d78021b706.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 7,
      title: "Whole Cumin Seeds",
      image: "142243c6982a0b8b776915568007e3f82a24e74c.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "best seller",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 8,
      title: "Whole Cumin Seeds",
      image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },

    {
      id: 9,
      title: "Whole Cumin Seeds",
      image: "9b12b7606d96c119efaa1f5498f4718a68810063.jpg",
      price: 7.99,
      oldPrice: null,
      tag: "premium",
      off: "",
      rating: 4,
      reviews: 189,
      left: 24,
      description: `Premium quality organic turmeric from Kerala, India. Rich... `,
      weight: "5g",
    },
  ];

  const title = "Kitchen";
  const categoriesData = [
    {
      name: "Cooking Appliances",
      children: [
        "Ovens & Microwaves",
        "Gas & Electric Stoves",
        "Air Fryers",
        "Pressure Cookers",
        "Induction Cooktops",
      ],
    },
    "All Spices",
    "Indian Spices",
    "Chinese Spices",
    "Thai Spices",
    "Blend Spices",
  ];

  const storesData = [
    "Bvr Spices",
    "Neam Spices",
    "Thika Masala",
    "Too Spicy",
    "Aron Masalas",
    "Farm Special",
    "Zafrani Mehal",
    "Chili Fresh",
    "Good Spices",
    "Good Spices",
    "Good Spices",
    "Good Spices",
    "Good Spices",
    "Good Spices",
    "Good Spices",
    "Good Spices",
  ];
  return (
    <div>
      <ProductPageHeader
        heading="Cook with Confidence, Live with Ease"
        text="From ovens to blenders, our appliances combine durability, style, and innovation to make everyday meals extraordinary."
        videoLink="/kitchens/Comp 1_9.mp4"
      />

      <HeadingDescription
        heading="Explore Our Collection"
        text="Shop By All Kitchen Appliances"
        description="Discover authentic quality appliances from across Asia"
      />

      <div className="lg:grid lg:grid-cols-[auto_1fr] lg:gap-4 container mx-auto p-5 lg:items-start ">
        <ProductFilterSearch
          // categoriesData={categoriesData}
          storesData={storesData}
          title1={"Kitchens Category"}
          title2={"Stores"}
        />
        <ProductCard />
      </div>
      <RegisterOnApp />
      <Reviews />
      <Footer />
    </div>
  );
};

export default KitchenAppliancesPage;
 */