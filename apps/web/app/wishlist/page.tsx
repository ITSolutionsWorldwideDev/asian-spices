import WishList from "@/components/layout/wishlist/WishList";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      <WishList />
      <Footer/>
    </div>
  );
};

export default page;
