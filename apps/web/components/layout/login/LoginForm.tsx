import React from "react";
import Image from "next/image";
import Link from "next/link";
const LoginForm = () => {
  return (
    <div className=" flex items-center justify-center ">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Welcome Asian Spices 👋
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Today is a new day. It's your day. You shape it. Sign in to start
          managing your projects.
        </p>

        {/* Form */}
        <form className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-bold">Email</label>
            <input
              type="email"
              placeholder="Example@email.com"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-bold">Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-sm text-gray-400">Or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Button */}
        <button className="w-full flex items-center justify-center gap-2  py-3 rounded-lg hover:bg-gray-50 transition bg-white">
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="text-sm font-medium text-gray-700">
            Sign in with Google
          </span>
        </button>

        {/* Login link */}
        <p className="text-sm text-gray-500 mt-6 font-bold">
          Don't you have an account?
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-10">
          © 2023 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
