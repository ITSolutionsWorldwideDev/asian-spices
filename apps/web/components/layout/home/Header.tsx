"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeaderContent from "./HeaderContent";

const frames = [
  {
    id: 1,
    title: "Golden Turmeric",
    subtitle: "Premium Collection",
    quality: "Organic & Pure",
    description: `Hand-picked organic turmeric from the highlands of India. Rich in curcumin with powerful anti-inflammatory properties and 
                  authentic earthy flavor.`,
    img: "a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp",
    stats: {
      Curcumin_Content: "95%",
      Customer_Rating: "4.9/5",
      Origin: "Kerala, India",
    },
  },
  {
    id: 2,
    title: "Authentic Asian Spices",
    subtitle: "Exotic Selection",
    quality: "Discover True Flavors",
    description: `Explore our curated collection of rare Asian spices. From fragrant cardamom to fiery chili peppers, experience the authentic taste of Asia in every dish.`,
    img: "0e72f704144da62cceae789fe0037f38a650f230.webp",
    stats: {
      varieties: "200+",
      countries: "15+",
      organic: "100%",
    },
  },
  {
    id: 3,
    title: "Traditional Spice Market",
    subtitle: "Heritage Quality",
    quality: "Farm To Table",
    description: `Experience the vibrant traditions of Asian spice markets. Premium quality spices sourced directly from trusted farmers who practice sustainable agriculture.`,
    img: "14b140c043c554c46173a4756175feabd5060b1f.webp",
    stats: {
      partnerfarms: "500+",
      fairtrades: "Yes",
      since: "2010",
    },
  },
];

export default function Header() {
  const [index, setIndex] = useState(0);

  // Auto change every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 1000000);

    return () => clearInterval(interval);
  }, []);

  const current = frames[index];

  return (
    <section className="relative w-full h-screen overflow-hidden ">
      {/* Background Image */}
      {current && (
        <>
          <Image
            src={`/assets/home/homeheaderimages/${current.img}`}
            alt={current.title}
            fill
            className="object-cover "
          />

          {/* Main Content */}
          <HeaderContent current={current} />
        </>
      )}

      {/* CENTER BOLD LINE BUTTONS */}
      <div className="absolute bottom-10 lg:left-1/2 left-1/4  flex gap-6 container mx-auto z-50">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 h-[5px] w-14 rounded-full  cursor-pointer
              ${index === i ? "bg-white" : "bg-white/30 hover:bg-white/50"}
            `}
          ></button>
        ))}
      </div>
      {/* <div className="text-white absolute  container mx-auto flex items-end"></div> */}
    </section>
  );
}
