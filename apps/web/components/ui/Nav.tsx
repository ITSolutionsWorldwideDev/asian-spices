import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  isDropdown?: boolean;
}

const Nav: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("Home");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { name: "Home" },
    { name: "About" },
    {
      name: "Category",
      children: [
        {
          name: "Spices",
          image: "524531ab08204ddf1a7e11f44c85ef183cbf3159 (1).jpg",
        },
        {
          name: "KitchenAppliances",
          image: "bef4555df0ac442433de79fbc2676fdbc3d5b455.jpg",
        },
        {
          name: "Recipes",
          image: "e50f5d03690c88ecb61ae41e5b6aa2fd285b988d.jpg",
        },
      ],
    },
  ];

  const handleClick = (name: string) => {
    setActiveLink(name);
    setIsMenuOpen(!isMenuOpen);
  };

  
  return (
    <div className="min-h-screen p-8 relative z-50">
      {/* Navbar */}
      <nav className="relative flex items-center justify-between p-2 md:p-4     container mx-auto">
        {/* Logo */}
        <a href="#" className="p-1">
          <img
            src="/assets/logo/Group 87.png"
            alt="Asian Spices Logo"
            className="h-14 w-auto object-cover rounded"
          />
        </a>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ul className="hidden md:flex items-center rounded-full px-10 py-2 space-x-6 bg-white/30 backdrop-blur shadow-inner">
            {navLinks.map((link) => (
              <li key={link.name} className="relative">
                {/* NON-DROPDOWN LINKS */}
                {!link.children ? (
                  <a
                    href={`/${link.name.toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}`}
                    onClick={() => handleClick(link.name)}
                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200
                     ${activeLink === link.name ? "text-amber-300" : "text-white/90 hover:text-amber-200"}`}
                  >
                    {link.name}

                    {activeLink === link.name && (
                      <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 w-1/2 mx-auto rounded-full"></span>
                    )}
                  </a>
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
                    {activeLink === link.name && (
                      <ul className="absolute top-full left-0 mt-5 bg-white text-black shadow-lg rounded-lg w-[250px] z-50">
                        {link.children.map((child) => (
                          <li key={child.name} className="">
                            <a
                              href={`/${child.name.toLowerCase()}`}
                              onClick={() => setActiveLink(child.name)}
                              className="flex items-center  px-4 py-2 text-black hover:bg-amber-800 transition-colors w-full"
                            >
                              <img
                                src={`/assets/navbar/${child.image}`}
                                alt={child.name}
                                className="w-12 h-7 object-cover rounded-md"
                              />
                              <span className="ml-5 font-bold">
                                {child.name}
                              </span>

                              {/* IMAGE ON RIGHT SIDE */}
                            </a>
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

        <div className="flex items-center space-x-3">
          {["Contact US", "Login/Signup"].map((btn: string) => (
            <button
              key={btn}
              className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
              onClick={() => console.log(`${btn} clicked`)}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        {/* {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-amber-900/95 shadow-xl rounded-lg md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleClick(link.name)}
                className={`block px-4 py-3 text-lg transition-colors duration-200 border-b border-amber-800 last:border-b-0 ${
                  activeLink === link.name
                    ? "text-amber-300 bg-amber-800/50"
                    : "text-white/90 hover:bg-amber-800"
                }`}
              >
                {link.name} {link.isDropdown && "▾"}
              </a>
            ))}
            <div className="p-4 flex flex-col space-y-2">
              {["Contact US", "Login/Signup"].map((btn: string) => (
                <button
                  key={btn}
                  className="px-4 py-2 bg-white text-black font-bold rounded-full"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )} */}
      </nav>

      {/* Page Content */}
    </div>
  );
};

export default Nav;
