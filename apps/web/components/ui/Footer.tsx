"use client";
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

export default function Footer() {
  return (
    <footer className="relative w-full  text-black py-12 bg-linear-to-r from-orange-700 to-orange-500]">
        {/* bg-[url('/assets/footer/775175c8c1ddc9012a4b84d26589e2965949605d.png') */}
      {/* <div className="absolute inset-0 w-[100vw] h-600  ">
        <img
          src="/assets/footer/775175c8c1ddc9012a4b84d26589e2965949605d.png"
          alt=""
          className=" object-cover"
        />
      </div> */}
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

          <div className="flex items-center gap-4 text-xl">
            <FaFacebookF className="cursor-pointer hover:scale-110 duration-150" />
            <FaInstagram className="cursor-pointer hover:scale-110 duration-150" />
            <IoLogoWhatsapp className="cursor-pointer hover:scale-110 duration-150" />
            <AiOutlineMail className="cursor-pointer hover:scale-110 duration-150" />
            <FaYoutube className="cursor-pointer hover:scale-110 duration-150" />
            <FaLinkedinIn className="cursor-pointer hover:scale-110 duration-150" />
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
          <p className="text-sm mb-5">
            Subscribe to our newsletter and receive exclusive recipes, spice
            tips, and special offers delivered to your inbox every week.
          </p>

          <div className="flex bg-white rounded-xl overflow-hidden shadow-md">
            <div className="flex items-center justify-center px-3">
              <AiOutlineMail size={20} />
            </div>

            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full outline-none py-3 px-2"
            />

            <button className="bg-black text-white px-6 text-sm hover:bg-gray-800 duration-150">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <p className="text-center mt-10 text-sm">
        Powered by IT Solutions Worldwide
      </p>
    </footer>
  );
}
