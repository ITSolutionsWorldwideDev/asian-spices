import Image from "next/image";
import { ArrowRight } from "lucide-react";
import RecipesProductCard from "@/components/ui/RecipesProductCard";

const cards = [
  {
    title: "Chicken Biryani Recipe",
    image: "0735f42afcaa80549c8b8ffa399da983921128e8.png", // replace with your image
    heading: (
      <>
        <span className="font-script text-white text-3xl">Chicken</span>{" "}
        <span className="text-orange-500 font-extrabold text-4xl">BIRYANI</span>
      </>
    ),
    description:
      "Chicken Biryani is a fragrant South Asian dish made by layering aromatic basmati rice with tender, spiced chicken, caramelized onions, fresh herbs, and saffron. Slow-cooked using the traditional dum method, it blends rich flavors and textures, making it a festive favorite for family gatherings and celebrations.",
  },
  {
    title: "Chicken Pizza Recipe",
    image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",
    heading: (
      <>
        <span className="font-script text-white text-3xl">Chicken</span>{" "}
        <span className="text-yellow-400 font-extrabold text-4xl">CHEES</span>{" "}
        <span className="text-orange-500 font-extrabold text-4xl">PIZZA</span>
      </>
    ),
    description:
      "A golden crust topped with tender chicken chunks, rich tomato sauce, and a generous layer of melted mozzarella and cheddar cheese. Seasoned with herbs and spices, this pizza blends savory chicken flavor with gooey, creamy cheese — a hearty favorite for casual meals, parties, and family gatherings.",
  },

  {
    title: "Chicken Pizza Recipe",
    image: "511d75edd299a537dadb2933ba8ea0178e2c3185.png",
    heading: (
      <>
        <span className="font-script text-white text-3xl">Chicken</span>{" "}
        <span className="text-yellow-400 font-extrabold text-4xl">CHEES</span>{" "}
        <span className="text-orange-500 font-extrabold text-4xl">PIZZA</span>
      </>
    ),
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

      <RecipesProductCard />
      {/* See More */}
      <div className="flex justify-center mt-14">
        <button className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl hover:bg-orange-500 transition">
          See More <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
