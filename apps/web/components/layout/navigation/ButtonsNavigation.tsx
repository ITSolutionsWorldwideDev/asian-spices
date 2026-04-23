// apps/web/components/layout/navigation/ButtonsNavigation.tsx

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { User, CircleUserRound } from "lucide-react";

const ButtonsNavigation = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // loading state (important)
  if (status === "loading") {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center space-x-3">
      {/* ✅ NOT LOGGED IN */}
      {!session && (
        <>
          <div className="hover:rotate-10 bg-white rounded-full hover:text-white">
            <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
              <Link href="/login" className="font-bold">
                Login
              </Link>
              {" / "}
              <Link href="/signup" className="font-bold">
                Signup
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ✅ LOGGED IN */}
      {session && (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-white p-2 rounded-full font-bold ml-2 cursor-pointer"
          >
            <User  size={24} />
            {/* {session.user?.email} */}
            {/* <User size={14} /> */}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow">
              <Link
                href="/account"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                My Account
              </Link>

              <Link
                href="/account/orders"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contact (always visible) */}
      <div className="hover:rotate-10 bg-white rounded-full hover:text-white">
        <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
          <Link href="/contactus" className="font-bold">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ButtonsNavigation;

/* import Link from "next/link";
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
        <div className="hover:rotate-10 bg-white rounded-full   hover:text-white ">
          <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
            <button className="   font-bold   hover:shadow-xl transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 cursor-pointer ">
              <Link href="/contactus">Contact Us</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; */

/* 
  const countries = [
    "Japan",
    "Greece",
    "Portugal",
    "Italy",
    "Spain",
    "Turkey",
    "Ireland",
    "Croatia",
    "France",
    "Canada",
    "Switzerland",
    "Mexico",
    "Germany",
    "India",
    "Thailand",
    "Morocco",
    "Austria",
    "Dominica",
    "Bhutan",
    "South Africa",
  ]; */

{
  /* <div className="hover:rotate-10 bg-white rounded-full   hover:text-white ">
          <div className="hover:bg-black hover:-rotate-10 px-6 py-3 rounded-full">
            {/* <button className="   ">
              <Link href="/contactus">Contact Us</Link>
            </button> */
}
{
  /* <select className="font-bold  hover:shadow-xl transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-0 cursor-pointer ">
              {countries.map((country) => (
                <option key={country} value={country} className="text-black">
                  {country}
                </option>
              ))}
            </select> */
}
{
  /* </div> */
}
{
  /* </div> */
}
