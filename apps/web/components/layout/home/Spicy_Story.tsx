import Image from "next/image";
import { ArrowRight } from "lucide-react";
import RecipesProductCard from "@/components/ui/RecipesProductCard";

const recipes_product_data = [
  {
    title: "Chicken Biryani Recipe",
    image: "0735f42afcaa80549c8b8ffa399da983921128e8.png", // replace with your image
    
    description:
      "Chicken Biryani is a fragrant South Asian dish made by layering aromatic basmati rice with tender, spiced chicken, caramelized onions, fresh herbs, and saffron. Slow-cooked using the traditional dum method, it blends rich flavors and textures, making it a festive favorite for family gatherings and celebrations.",
  },
  {
    title: "Chicken Pizza Recipe",
    image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",
   
    description:
      "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
  },

  {
    title: "Chicken Pizza Recipe",
    image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",
    
    description:
      "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
  },
];

export default function Spicy_Story() {
  return (
    <section className="container mx-auto  py-16">
      {/* Heading */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-14">
        Where Every Dish Tells a Spicy Story 🔥{" "}
      </h2>

      {/* Cards */}

      <div className="grid grid-cols-1 md:flex gap-10 overflow-hidden">
        {recipes_product_data.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl min-w-[45%]"
          >
            <RecipesProductCard card={card} />
          </div>
        ))}
      </div>

      {/* See More */}
      <div className="flex justify-center mt-14">
        <button className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl hover:bg-orange-500 transition">
          See More <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
