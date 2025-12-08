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

  const navLinks: NavLink[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Category", href: "#category", isDropdown: true },
  ];

  const handleClick = (name: string) => {
    setActiveLink(name);
    setIsMenuOpen(false);
  };

  //   const logo: string = "https://placehold.co/150x60/d9534f/ffffff?font=Montserrat&text=Asian+Spices";

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
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center rounded-full px-10 py-2 space-x-6 bg-[#957753] shadow-inner">
            {navLinks.map((link: NavLink) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleClick(link.name)}
                className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  activeLink === link.name
                    ? "text-amber-300"
                    : "text-white/90 hover:text-amber-200"
                }`}
              >
                <span className="flex items-center">
                  {link.name}
                  {link.isDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </span>
                {activeLink === link.name && (
                  <span className="absolute left-0 right-0 bottom-0 h-1 bg-amber-400 rounded-full transition-all duration-300 w-1/2 mx-auto"></span>
                )}
                {link.isDropdown && activeLink === "Category" && (
                  <div className="absolute top-full left-0 mt-1 bg-amber-900/95 shadow-lg rounded-lg min-w-[150px] z-50">
                    {["Alpha", "Beta", "Gema", "Sisa", "Giga"].map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setActiveLink(item)}
                        className="block px-4 py-2 text-white/90 hover:bg-amber-800 transition-colors"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>

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
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-amber-900/95 shadow-xl rounded-lg md:hidden">
            {navLinks.map((link: NavLink) => (
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
        )}
      </nav>

      {/* Page Content */}
    </div>
  );
};

export default Nav;
