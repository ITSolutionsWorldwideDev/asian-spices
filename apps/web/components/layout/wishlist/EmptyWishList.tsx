import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
// import Nav from "@/components/ui/Nav";
const EmptyWishList = () => {
  return (
    <div className="bg-white  p-8">
      {/* <div className="bg-black">
        <Nav />
      </div> */}
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <Heart size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-center text-lg">
            Your wishlist is empty
          </p>
          <p className="text-gray-400 text-center text-sm mt-2">
            Start adding your favorite spices!
          </p>
          <Link href={"/"}>
            <button className="mt-6 px-6 py-3 bg-linear-to-r from-[#FF6900] to-[#F83701] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyWishList;
