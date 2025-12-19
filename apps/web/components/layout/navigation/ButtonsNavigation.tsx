import Link from "next/link";
import React from "react";

const ButtonsNavigation = () => {
  return (
    <div className="lg:flex items-center space-x-3 hidden">
      {/* <div className="bg-white rounded-full hover:rotate-10">
          <button className="px-6 py-3  hover:bg-black hover:-rotate-10 hover:text-white font-bold rounded-full shadow-lg hover:shadow-xl   focus:ring-4 focus:ring-white/50">
            <Link href="/contactus">Contact US</Link>
          </button>
        </div> */}

      <div className="hover:rotate-10 bg-white rounded-full   hover:text-white ">
        <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
          <button className="  font-bold   hover:shadow-xl transform cursor-pointer focus:outline-none focus:ring-4 ">
            <Link href="/login">Login</Link>
          </button>
          /
          <button className="   font-bold   hover:shadow-xl transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 cursor-pointer ">
            <Link href="/signup">Signup</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonsNavigation;
