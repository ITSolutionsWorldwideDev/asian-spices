import ProductPageHeader from "@/components/ui/ProductPageHeader";
import HeadingDescription from "@/components/ui/HeadingDescription";

import React from "react";

const RecipesPage = () => {
  


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

       
    </div>
  );
};

export default RecipesPage;
