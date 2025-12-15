

import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto p-10 bg-gray-100">
        <div className=" flex items-center justify-center ">
          <div className="w-full max-w-md text-center">
            {/* Heading */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Welcome Asian Spices 👋
            </h1>

            {/* Form */}
            <form className="space-y-4 text-left">
              {/* Email */}
              <div>
                <label className="text-sm text-gray-600 font-bold">Email</label>
                <input
                  type="email"
                  placeholder="Example@email.com"
                  className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Phone No
                </label>
                <input
                  type="tel"
                  placeholder="+914 1665 49894"
                  className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Confirm Password
                </label>
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
                Sign up
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-sm text-gray-400">Or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <button className="w-full flex items-center justify-center gap-2 bg-white py-3 rounded-lg hover:bg-gray-50 transition">
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
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>

            {/* Footer */}
            <p className="text-xs text-gray-400 mt-10">
              © 2023 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>

        <div className="w-full h-100 md:h-full relative">
          <Image
            src={`/assets/signup_form/bfd700b0e493c1d48adf286de20d6404d2059543.jpg`}
            alt="sign up "
            fill
            className="rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
