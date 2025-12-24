import Link from "next/link";
import React from "react";

const ButtonsNavigation = () => {
  return (
    <>
      <div className="lg:flex items-center space-x-3 hidden ">
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
    </>
  );
};

export default ButtonsNavigation;
