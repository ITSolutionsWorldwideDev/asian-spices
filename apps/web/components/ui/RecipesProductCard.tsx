import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react';

const RecipesProductCard = () => {

  const recipes_product_data = [
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
  return (
   <div className="grid grid-cols-1 md:flex gap-10 overflow-hidden">
        {recipes_product_data.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl min-w-[45%]"
          >
            {/* Image */}
            <div className="relative h-64 rounded-2xl overflow-hidden m-5">
              <Image
                src={`/assets/home/spicy_story/${card.image}`}
                alt="food"
                fill
                className=" object-cover"
              />

              {/* Overlay text */}
              <div className="absolute inset-0 flex items-center justify-end pr-6 bg-black/30">
                <div className="text-right leading-tight">{card.heading}</div>
              </div>
            </div>

            {/* Content */}
            <div className="px-7 pb-7">
              <h3 className="text-lg font-bold mb-2">{card.title}:</h3>

              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {card.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-semibold text-black hover:text-orange-500 transition">
                Explore <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
  )
}

export default RecipesProductCard