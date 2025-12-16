"use client";

import Image from "next/image";
import { GoTag } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa6";

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

interface ProductCardProps {
  item: Product[];
}

export default function ProductCard({ item }: ProductCardProps) {
  console.log(item);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const visibleProducts = showAll ? item : item.slice(0, 8);

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-2xl transition p-4 relative"
          >
            {/* Tags */}
            {product.tag && (
              <span className="absolute top-1/11 left-1/11 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                {product.tag}
              </span>
            )}

            {product.off && (
              <span className="absolute top-1/6 left-1/11 bg-red-500 font-bold text-white text-xs px-2 py-1 rounded-full flex items-center">
                <GoTag className="mr-2" />
                {product.off}
              </span>
            )}

            {/* Like button */}
            <button
              onClick={() => toggleLike(product.id)}
              className="absolute top-1/11 right-1/11 bg-white rounded-full p-2 shadow transition hover:scale-110"
            >
              {liked[product.id] ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <CiHeart className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Product left in stock */}
            {product.left && (
              <span className="absolute bottom-[45%] right-1/11 bg-white text-black text-xs px-2 py-1 rounded-full flex items-center">
                Only {product.left} Left!
              </span>
            )}

            {/* Image */}
            <Image
              src={`/assets/home/premium_collection/${product.image}`}
              alt={product.title}
              width={120}
              height={100}
              className="h-70 w-full object-cover rounded-xl"
            />

            {/* Rating */}
            <div className="flex items-center text-yellow-500 text-sm mt-3">
              {"★".repeat(product.rating)}
              <span className="text-gray-400 ml-1">({product.reviews})</span>
            </div>

            {/* Title */}
            <h3 className="font-semibold mt-1">{product.title}</h3>
            <span className="text-sm text-gray-400">
              {product.description.split(" ").slice(0, 10).join(" ")}
            </span>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-orange-400 font-bold text-xl">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="line-through text-gray-400 text-sm">
                  ${product.oldPrice}
                </span>
              )}
            </div>

            {/* Button */}
            <button className="mt-4 w-full bg-linear-to-r from-orange-400 to-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center">
              <BsCartPlus className="w-7 h-6 mr-3" /> Add To Cart
            </button>
          </div>
        ))}
      </div>

      {/* See More/See Less Button */}

      {item.length > 8 && (
        <div className="flex justify-center mt-8 mb-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center justify-center px-10 py-5 bg-black hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            {showAll ? (
              "See Less"
            ) : (
              <>
                See More
                <FaArrowRight className="ml-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
