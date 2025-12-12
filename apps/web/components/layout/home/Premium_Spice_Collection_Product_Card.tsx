"use client";

import Image from "next/image";
import { GoTag } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { BsCartPlus } from "react-icons/bs";

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: number | null;
  tag: string;
  off: string;
  rating: number;
  reviews: number;
  left: number;

  description: string;
};

export default function Premium_Spice_Collection_Product_Card({
  item,
}: {
  item: Product;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition p-4 relative">
      {/* Tags */}

      {item.tag && (
        <span className="absolute top-1/11 left-1/11 bg-yellow-500  text-white text-xs px-2 py-1 rounded-full flex items-center ">
          {item.tag}
        </span>
      )}

      {item.off && (
        <span className="absolute top-1/6 left-1/11 bg-red-500 font-bold text-white text-xs px-2 py-1 rounded-full flex items-center ">
          <GoTag className="mr-2 " />
          {item.off}
        </span>
      )}

      {/* ////like button */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-1/11 right-1/11 bg-white rounded-full p-2 shadow transition hover:scale-110"
      >
        {liked ? (
          <FaHeart className="w-5 h-5 text-red-500" />
        ) : (
          <CiHeart className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* ///product left in stock */}
      {item.left && (
        <span className="absolute bottom-[45%] right-1/11 bg-white  text-black text-xs px-2 py-1 rounded-full flex items-center ">
          Only {item.left} Left!
        </span>
      )}
      {/* Image */}
      <Image
        src={`/assets/home/premium_collection/${item.image}`}
        alt={item.title}
        width={120}
        height={100}
        className="h-70 w-full object-cover rounded-xl"
      />

      {/* Rating */}
      <div className="flex items-center text-yellow-500 text-sm mt-3">
        {"★".repeat(item.rating)}
        <span className="text-gray-400 ml-1">({item.reviews})</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold mt-1">{item.title}</h3>
      <span className=" text-sm text-gray-400">
        {" "}
        {item.description.split(" ").slice(0, 10).join(" ")}
      </span>
      {/* Price */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-orange-400 font-bold text-xl">${item.price}</span>

        {item.oldPrice && (
          <span className="line-through text-gray-400 text-sm">
            ${item.oldPrice}
          </span>
        )}
      </div>

      {/* Button */}
      <button className="mt-4 w-full bg-linear-to-r from-orange-400 to-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center">
        <BsCartPlus className="w-7 h-6 mr-3" /> Add To Cart
      </button>
    </div>
  );
}
