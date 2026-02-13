"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { Menu } from "lucide-react";
import { Heart } from "lucide-react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Cart from "@/components/ui/Cart";
import { createPortal } from "react-dom";
import { FaL } from "react-icons/fa6";

interface NavChildren {
  name: string;
  image: string;
  href: string;
}

interface NavLink {
  name: string;
  children?: NavChildren[];
}
const ResponsiveNavigation = () => {
  const [activeLink, setActiveLink] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);

  const handleClick = (name: string) => {
    setActiveLink(name);
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks: NavLink[] = [
    { name: "Home" },
    { name: "About" },
    {
      name: "Category",
      children: [
        {
          name: "Spices",
          image: "524531ab08204ddf1a7e11f44c85ef183cbf3159 (1).jpg",
          href: "spices",
        },
        {
          name: "KitchenAppliances",
          image: "bef4555df0ac442433de79fbc2676fdbc3d5b455.jpg",
          href: "kitchen-appliances",
        },
        {
          name: "Recipes",
          image: "e50f5d03690c88ecb61ae41e5b6aa2fd285b988d.jpg",
          href: "recipes  ",
        },
        {
          name: "Foods & Beverages ",
          image: "7998dbf578bd435e51167e00d97f1bc7f0963051.png",
          href: "foods-beverages",
        },
      ],
    },
    { name: "Seller Hub" },
  ];

  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  return (
    <>
      {/* mobilemenubtn */}

      <div className="lg:hidden border border-green-500 rounded-2xl">
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        >
          {mobileMenu ? (
            <RxCross1 className="h-10 w-10" />
          ) : (
            <Menu className="h-10 w-10" />
          )}
        </button>
      </div>

      {/* deskstop navigatio */}
      <div className="hidden lg:flex items-center space-x-4 ">
        <ul className=" flex items-center rounded-full  py-2 space-x-6 bg-white/30 backdrop-blur shadow-inner p-10">
          {navLinks.map((link) => (
            <li key={link.name} className="relative">
              {/* NON-DROPDOWN LINKS */}

              {link.name.toLocaleLowerCase() == "home" ? (
                <Link
                  href={`/`}
                  onClick={() => handleClick(link.name)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200
                     ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}`}
                >
                  {link.name}

                  {activeLink === link.name && (
                    <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-1/2 mx-auto rounded-full"></span>
                  )}
                </Link>
              ) : !link.children ? (
                <Link
                  href={`/${link.name
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "")}`}
                  onClick={() => handleClick(link.name)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200
                     ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}`}
                >
                  {link.name}

                  {activeLink === link.name && (
                    <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-1/2 mx-auto rounded-full"></span>
                  )}
                </Link>
              ) : (
                <>
                  {/* DROPDOWN BUTTON */}
                  <button
                    onClick={() => handleClick(link.name)}
                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 flex items-center
                        ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}
            `}
                  >
                    {link.name}
                    <ChevronDown className="ml-1 h-4 w-4" />

                    {activeLink === link.name && (
                      <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-1/2 mx-auto rounded-full"></span>
                    )}
                  </button>

                  {/* DROPDOWN MENU */}
                  {activeLink === link.name && isMenuOpen && (
                    <ul
                      className={`${isMenuOpen ? "animate-slideDown" : "animate-slideUp"} absolute top-full left-0 mt-5 bg-white text-black shadow-lg rounded-lg w-[250px] z-50`}
                    >
                      {link.children.map((child) => (
                        <li key={child.name} className="">
                          <Link
                            href={`/${child.href}`}
                            className="flex items-center  px-4 py-2 text-black hover:bg-amber-800 transition-colors w-full"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                          >
                            <img
                              src={`/assets/navbar/${child.image}`}
                              alt={child.name}
                              className="w-12 h-7 object-cover rounded-md"
                            />
                            <span className="ml-5 font-bold">{child.name}</span>

                            {/* IMAGE ON RIGHT SIDE */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
      </div>

      {/* mobile navigation */}
      {mobileMenu && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-amber-900/95 shadow-xl rounded-lg lg:hidden">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="border-b border-amber-800 last:border-b-0"
            >
              {/* NON-DROPDOWN LINKS */}
              {!link.children ? (
                <Link
                  href={
                    link.name.toLowerCase() === "home"
                      ? "/"
                      : `/${link.name
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .trim()
                          .replace(/\s+/g, "")}`
                  }
                  onClick={() => {
                    handleClick(link.name);
                    setMobileMenu(!mobileMenu);
                  }}
                  className={`block px-4 py-3 text-lg transition-colors duration-200 ${
                    activeLink === link.name
                      ? "text-amber-300 bg-amber-800/50"
                      : "text-white/90 hover:bg-amber-800"
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <>
                  {/* DROPDOWN BUTTON */}
                  <button
                    onClick={() => handleClick(link.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-lg transition-colors duration-200 ${
                      activeLink === link.name
                        ? "text-amber-300 bg-amber-800/50"
                        : "text-white/90 hover:bg-amber-800"
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* DROPDOWN CHILDREN */}
                  {activeLink === link.name && (
                    <div className="bg-amber-800/60">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={`/${child.href}`}
                          onClick={() => setMobileMenu(false)}
                          className="flex items-center gap-4 px-6 py-3 text-white/90 hover:bg-amber-700 transition-colors"
                        >
                          <img
                            src={`/assets/navbar/${child.image}`}
                            alt={child.name}
                            className="w-12 h-7 object-cover rounded-md"
                          />
                          <span className="font-semibold">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* ACTION BUTTONS */}
          <div
            className="p-4 flex flex-col space-y-2"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <div className=" bg-white rounded-full   ">
              <div className=" px-6 py-3 rounded-full flex justify-center">
                <button className="  font-bold   hover:shadow-xl transform cursor-pointer hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 ">
                  <Link href="/login">Login</Link>
                </button>
                /
                <button className="   font-bold   hover:shadow-xl transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 cursor-pointer ">
                  <Link href="/signup">Signup</Link>
                </button>
              </div>
            </div>

            <div className=" bg-white rounded-full   ">
              <div className=" px-6 py-3 rounded-full flex justify-center">
                <button className="  font-bold   hover:shadow-xl transform cursor-pointer hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 ">
                  <Link href="/contactus">Contact Us</Link>
                </button>
              </div>
            </div>
          </div>

          {/* cart and wish button */}
          <div className="flex items-center space-x-3 justify-center mb-4">
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
          </div>
        </div>
      )}

      {isCartOpen &&
        createPortal(
          <div className="absolute top-10 h-full w-full z-9999 ">
            <Cart />
            <div className="bg-white rounded-2xl p-2  text-center   shadow-lg hover:shadow-xl cursor-pointer">
              <button
                className="bg-red-500 w-full text-white rounded-xl font-bold p-2"
                onClick={() => setCartOpen(false)}
              >
                Close cart
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ResponsiveNavigation;
