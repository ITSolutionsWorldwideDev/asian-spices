"use client";

import Image from "next/image";
import {
  Heart,
  Trash2,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  Star,
} from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
// import Nav from "@/components/ui/Nav";
import EmptyWishList from "./EmptyWishList";
import RedirectButtons from "./RedirectButtons";
import ProductCard from "@/components/ui/ProductCard";
import ProductDesc from "@/components/ui/ProductDesc";
// import Footer from "@/components/ui/Footer";

export default function WishList() {
  const {
    items: wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistStore();
  const { addToCart } = useCartStore();
  console.log(wishlist);
  const totalValue = wishlist.reduce((acc, item) => acc + (item.price || 0), 0);

  const potentialSavings = wishlist.reduce((acc, item) => {
    if (!item.oldPrice || !item.price) return acc;
    return acc + (item.oldPrice - item.price);
  }, 0);

  const itemsInWishlist = wishlist.length;

  if (wishlist.length === 0) {
    return <EmptyWishList />;
  }

  return (
    <div className="">
      {/* <div className="bg-black">
        <Nav />
      </div> */}

      <div className="bg-white  p-8">
        <div className="container mx-auto">
          <div className="p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base">
              <Link href={"/"}>
                <p className="text-[#6A7282]">Home</p>
              </Link>
              <p className="text-[#6A7282]"> / </p>
              <p className="text-[#6A7282]">Wishlist</p>
            </div>

            {/* Title */}
            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-bold text-3xl sm:text-5xl flex items-center gap-3">
                  My Wishlist
                  <span className="inline-block text-sm sm:text-base px-3 py-1 rounded-full bg-orange-500 text-white font-medium">
                    {itemsInWishlist} items
                  </span>
                </h1>
                <p className="text-gray-500 mt-2">
                  Your favorite spices saved for later
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
                <Link href={"/"}>
                  <button className="px-6 py-2 bg-linear-to-r from-[#FF6900] to-[#F83701] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Saved Items */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFEDD4] rounded-xl flex items-center justify-center">
                    <Heart size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Saved Items</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {itemsInWishlist}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Value */}
              <div className=" border border-[#E5E7EB] rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-[#00A63E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Potential Savings */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F3E8FF] rounded-xl flex items-center justify-center">
                    <Sparkles className="text-[#9810FA]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Potential Savings</p>
                    <p className="text-3xl font-bold text-[#00A63E]">
                      ${potentialSavings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="mt-8 space-y-4 px-4 sm:px-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* IMAGE with Badge */}
                  <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {item.oldPrice && item.price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                        {item.off ||
                          `${Math.round(
                            ((item.oldPrice - item.price) / item.oldPrice) *
                              100,
                          )}% OFF`}
                      </div>
                    )}
                    <Image
                      src={`/assets/home/premium_collection/${item.image}`}
                      alt={item.title}
                      width={128}
                      height={128}
                      className="object-cover h-full w-full"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>

                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {item.reviews && (
                            <span className="text-sm text-gray-500">
                              ({item.reviews})
                            </span>
                          )}

                          {item.tag && (
                            <span className="inline-block text-xs px-2 py-1 rounded-full border border-[#E5E7EB] text-black">
                              {item.tag}
                            </span>
                          )}

                          {item.weight && (
                            <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {item.weight}
                            </span>
                          )}
                        </div>
                      )}

                      {item.price && (
                        // console.log(item)
                        <div className="flex items-center  space-x-1">
                          <p className="font-bold text-2xl text-orange-500">
                            ${item.price.toFixed(2)}
                          </p>
                          {item.oldPrice && (
                            <p className="text-sm text-gray-400 line-through">
                              ${item.oldPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {/* <div className="flex items-center gap-2 mt-2 flex-wrap"></div>

                    {/* Description */}
                      {/* {item.description && (
                      <p className="text-sm text-gray-500 mt-2">
                        {item.description}
                      </p>
                    )} */}
                    </div>

                    {/* PRICE & ACTIONS */}
                    {/* <div className="flex flex-col items-start sm:items-end justify-between gap-4"> */}
                    {/* Action Buttons */}
                    <div className="flex flex-col  justify-center gap-2 w-50 relative ">
                      <button
                        onClick={() => {
                          //  id: number;
                          // title: string;
                          // price: number;
                          // quantity: number;
                          // image: string;
                          // weight?: string;
                          // oldPrice: number | null;
                          addToCart(item);
                          removeFromWishlist(item.id);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF6900] text-white rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>

                      <Link href={"/product"}>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors cursor-pointer w-full">
                          View Details
                          {/* <ProductCar d item={wishlist} /> */}
                        </button>
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className=" md:absolute top-0 right-0 md:w-fit border-2 border-[#E5E7EB]  shadow-md text-black rounded-xl bg-white px-3 py-3 hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <RedirectButtons />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
