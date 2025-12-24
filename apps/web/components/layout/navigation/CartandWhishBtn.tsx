"use client";
import React from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Heart } from "lucide-react";
import { useState } from "react";
import Cart from "@/components/ui/Cart";
import { createPortal } from "react-dom";
const CartandWhishBtn = () => {
  const [isCartOpen, setCartOpen] = useState<boolean>(false);

  return (
    <div className="lg:flex items-center space-x-3 hidden ">
      <div
        className="bg-white rounded-full cursor-pointer "
        onClick={() => setCartOpen(!isCartOpen)}
      >
        <button className="px-2 py-2    font-bold rounded-full shadow-lg hover:shadow-xl   focus:ring-4 focus:ring-white/50 cursor-pointer">
          <Heart />
        </button>
      </div>

      <div
        className="bg-white rounded-full cursor-pointer "
        onClick={() => setCartOpen(!isCartOpen)}
      >
        <button className="px-3 py-3    font-bold rounded-full shadow-lg hover:shadow-xl   focus:ring-4 focus:ring-white/50 cursor-pointer">
          <HiOutlineShoppingBag />
        </button>
      </div>

      {isCartOpen &&
        createPortal(
          <div className="absolute top-30 left-0 h-full w-full z-9999 ">
            <Cart />
          </div>,
          document.body
        )}
    </div>
  );
};

export default CartandWhishBtn;
