import React from "react";

import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
const FooterContent = () => {
  return (
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 ">
      {/* Logo + Social Icons */}
      <div>
        <Image
          src="/assets/logo/Group 88.png"
          alt="Asian Spices Logo"
          width={120}
          height={80}
          className="mb-6"
        />

        <div className="flex items-center gap-4 text-xl mt-20  ">
          <div className="rounded-full p-1  bg-white/40">
            <FaFacebookF className=" text-black cursor-pointer hover:scale-110 duration-150    " />
          </div>
          <div className="rounded-full p-1  bg-white/40">
            <FaInstagram className="cursor-pointer hover:scale-110 duration-150 " />
          </div>
          <div className="rounded-full p-1  bg-white/40">
            <IoLogoWhatsapp className="cursor-pointer hover:scale-110 duration-150 " />
          </div>
          <div className="rounded-full p-1  bg-white/40">
            <AiOutlineMail className="cursor-pointer hover:scale-110 duration-150 " />
          </div>
          <div className="rounded-full p-1  bg-white/40">
            <FaYoutube className="cursor-pointer hover:scale-110 duration-150 " />
          </div>
          <div className="rounded-full p-1  bg-white/40">
            <FaLinkedinIn className="cursor-pointer hover:scale-110 duration-150 " />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="text-left">
        <h2 className="font-semibold text-lg mb-4">Menu</h2>

        <ul className="space-y-3">
          <li>
            <Link href="#" className="hover:underline">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Privacy & Policy
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Products
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              Careers
            </Link>
          </li>
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Newsletter</h2>
        <p className="text-sm mb-5 text-white">
          Subscribe to our newsletter and receive exclusive recipes, spice tips,
          and special offers delivered to your inbox every week.
        </p>

        <div className="flex bg-white rounded-xl overflow-hidden shadow-md">
          <div className="flex items-center justify-center px-3 text-gray-400">
            <AiOutlineMail size={20} />
          </div>

          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full outline-none py-3 px-2 "
          />

          <button className="bg-black text-white  px-6 text-sm hover:bg-gray-800 duration-150">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterContent;
