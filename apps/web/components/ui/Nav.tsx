import React from "react";

import Link from "next/link";
import ButtonsNavigation from "../layout/navigation/ButtonsNavigation";
import ResponsiveNavigation from "../layout/navigation/ResponsiveNavigation";

const Nav: React.FC = () => {
  return (
    <div className="relative inset-0 p-8  z-50">
      {/* Navbar */}
      <nav className="relative flex items-center justify-between p-2 md:p-4 container mx-auto">
        {/* Logo */}
        <Link href="/" className="p-1">
          <img
            src="/assets/logo/Group 87.png"
            alt="Asian Spices Logo"
            className="h-10 md:h-14 md:w-auto md:object-cover rounded"
          />
        </Link>

        {/* Desktop Navigation */}
        <ResponsiveNavigation />
        <ButtonsNavigation />
      </nav>
    </div>
  );
};

export default Nav;
