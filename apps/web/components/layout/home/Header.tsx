"use client";
import { FaTruckFast } from "react-icons/fa6";
import { CiTrophy } from "react-icons/ci";
import { LuSalad } from "react-icons/lu";

import { useEffect, useState } from "react";
import Image from "next/image";
import Nav from "@/components/ui/Nav";

const frames = [
  {
    id: 1,
    title: "Golden Turmeric",
    subtitle: "Premium Collection",
    description: `Hand-picked organic turmeric from the highlands of India. Rich in curcumin with powerful anti-inflammatory properties and 
                  authentic earthy flavor.`,
    img: "/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4.jpg",
    stats: {
      Curcumin_Content: "95%",
      Customer_Rating: "4.9/5",
      Origin: "Kerala, India",
    },
  },
  {
    id: 2,
    title: "Premium Indian Masalas",
    subtitle: "Taste the Tradition",
    description:
      "Experience aromatic masalas sourced from the finest spice farms of India.",
    img: "/assets/home/homeheaderimages/0e72f704144da62cceae789fe0037f38a650f230.jpg",
    stats: {
      varieties: "150+",
      countries: "10+",
      organic: "90%",
    },
  },
  {
    id: 3,
    title: "Middle Eastern Spice Blends",
    subtitle: "Exotic Selection",
    description:
      "A selection of bold and earthy flavors used across Middle Eastern cuisine.",
    img: "/assets/home/homeheaderimages/0e72f704144da62cceae789fe0037f38a650f230.jpg",
    stats: {
      varieties: "180+",
      countries: "12+",
      organic: "95%",
    },
  },
];

export default function Header() {
  const [index, setIndex] = useState(0);

  // Auto change every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 100000000);

    return () => clearInterval(interval);
  }, []);

  const current = frames[index];

  return (
    <section className="relative w-full h-screen overflow-hidden ">
      {/* Background Image */}
      {current && (
        <>
          <Image
            src={current.img}
            alt={current.title}
            fill
            className="object-cover brightness-[0.45]"
          />
          <Nav />
          {/* Main Content */}
          <div className="absolute inset-0 flex items-center container mx-auto overflow-hidden mt-10">
            <div className="px-8 md:px-20 max-w-3xl text-white">
              <span className="bg-white/20 text-sm px-4 py-1 rounded-full inline-block mb-4 border border-white/30">
                {current.subtitle}
              </span>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {current.title}
              </h1>

              <p className="text-lg text-gray-200 mb-6">
                {current.description}
              </p>

              {/* Stats */}
              <div className="flex gap-12 mb-8">
                <div>
                  <p className="text-3xl font-bold">
                    {current.stats.varieties}
                  </p>
                  <p className="text-sm text-gray-300">Varieties</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {current.stats.countries}
                  </p>
                  <p className="text-sm text-gray-300">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{current.stats.organic}</p>
                  <p className="text-sm text-gray-300">Certified Organic</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                  Shop Collection
                </button>

                <button className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition">
                  Watch Story
                </button>
              </div>
              <div className="text-white  flex mt-10 gap-5">
                <p className="flex items-center gap-3 justify-center text-center">
                  <span className="bg-green-500 rounded-4xl h-8 flex items-center">
                    <LuSalad className="w-8    " />
                  </span>
                  100% organic
                </p>
                <p className="flex items-center gap-3 justify-center text-center">
                  <span className="bg-yellow-400 rounded-4xl h-8 flex items-center">
                    <CiTrophy className="w-8    " />
                  </span>
                  Premium Quality
                </p>
                <p className="flex items-center gap-3 justify-center text-center">
                  <span className="bg-red-700 rounded-4xl h-8 flex items-center">
                    <FaTruckFast className="w-8    " />
                  </span>
                  Free Shipping
                </p>
              </div>
            </div>
          </div>
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
      <div className="text-white absolute  container mx-auto flex items-end"></div>
    </section>
  );
}
