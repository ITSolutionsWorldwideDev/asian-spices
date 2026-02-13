"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SignupForm = () => {
  const [type, setType] = useState<"user" | "partner">("user");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md text-center">
        {/* Logo */}
        <Link href="/" className="flex justify-center">
          <Image
            src="/assets/logo/Group 87.png"
            alt="Asian Spices"
            width={60}
            height={60}
            className="mb-6 cursor-pointer"
          />
        </Link>

        {/* Heading */}
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Welcome Asian Spices 👋
        </h1>

        {/* Toggle */}
        <div className="mb-8 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setType("user")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition
              ${
                type === "user"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500"
              }`}
          >
            Signup as User
          </button>

          <button
            onClick={() => setType("partner")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition
              ${
                type === "partner"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500"
              }`}
          >
            Signup as Partner
          </button>
        </div>

        {/* ================= USER FORM ================= */}
        {type === "user" && (
          <form className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-600">Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Phone No</label>
              <input
                type="tel"
                placeholder="+914 1665 49894"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white
                         hover:bg-slate-800 transition"
            >
              Sign up
            </button>
          </form>
        )}

        {/* ================= PARTNER FORM ================= */}
        {type === "partner" && (
          <form className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-600">
                Company Name
              </label>
              <input
                type="text"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Username</label>
              <input
                type="text"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Password</label>
              <input
                type="password"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">
                Countries (COC)
              </label>
              <input
                type="text"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">KvK</label>
              <input
                type="text"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">iDIN</label>
              <input
                type="text"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">VAT Check</label>
              <input
                type="text"
                className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white
                         hover:bg-slate-800 transition"
            >
              Register as Partner
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-6 text-sm font-bold text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        <p className="mt-10 text-xs text-gray-400">
          © 2025 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
