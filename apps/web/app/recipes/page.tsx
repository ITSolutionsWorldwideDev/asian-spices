import ProductPageHeader from "@/components/ui/ProductPageHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";

import React from "react";
import RegisterOnApp from "@/components/ui/RegisterOnApp";
import Reviews from "@/components/ui/Reviews";
import Footer from "@/components/ui/Footer";
import ProductFilterSearch from "@/components/ui/ProductFilterSearch";
import ProductDisplay from "@/components/layout/recipes/ProductDisplay";

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
        <ProductFilterSearch
          categoriesData={categoriesData}
          storesData={storesData}
          title1={"Recipes By Items"}
          title2={"Recipes By Culture"}
        />
        <ProductDisplay />
      </div>
      <RegisterOnApp />
      <Reviews />
      <Footer />
    </div>
  );
};

export default RecipesPage;
