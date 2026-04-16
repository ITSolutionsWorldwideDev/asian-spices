import Cart from "@/components/ui/Cart";
import Footer from "@/components/ui/Footer";
import Nav from "@/components/ui/Nav";
import React from "react";
import { getServerSession } from "next-auth";
import { webAuthOptions } from "@acme/auth";

const page = async () => {
  // const session = await getServerSession(webAuthOptions);
  // console.log(session);
  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>
      <Cart />
      <Footer />
    </div>
  );
};

export default page;
