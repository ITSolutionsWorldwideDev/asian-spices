import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
interface RecipeCard{
  title:string;
  image:string;
  description:string;
}

interface RecipesProductCardProps {
  card: RecipeCard;
}

const RecipesProductCard = ({card}:RecipesProductCardProps) => {

  
 
  return (
    // <div className="grid grid-cols-1 md:flex gap-10 overflow-hidden">
    //   {recipes_product_data.map((card, index) => (
    //     <div key={index} className="bg-white rounded-3xl shadow-xl min-w-[45%]">
    // {/* Image */}

    <div className="h-auto">
      <div className="relative h-64 rounded-2xl overflow-hidden m-5">
        <Image
          src={`/assets/home/spicy_story/${card.image}`}
          alt="food"
          fill
          className=" object-cover"
        />

        {/* Overlay text */}
        {/* <div className="absolute inset-0 flex items-center justify-end pr-6 bg-black/30">
          <div className="text-right leading-tight">{card.heading}</div>
        </div> */}
      </div>

      {/* Content */}
      <div className="px-7 pb-7">
        <h3 className="text-lg font-bold mb-2">{card.title}:</h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {card.description}
        </p>

        <button className="w-full flex items-center justify-end  gap-2 text-sm font-semibold text-black hover:text-orange-500 transition">
          Explore <ArrowRight size={16} />
        </button>
      </div>
    </div>
    // </div>
  );
  // </div>
};

export default RecipesProductCard;
