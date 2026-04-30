// apps/web/components/layout/login/LoginForm.tsx

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useLoaderStore } from "@/store/useLoaderStore";

/* ---------------- SCHEMA ---------------- */
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password required"),
});

export default function LoginForm() {
  const router = useRouter();

  const { show, hide } = useLoaderStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* ---------------- HELPERS ---------------- */

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // clear field error on change
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  function zodToFieldErrors(issues: z.ZodIssue[]): Record<string, string> {
    const errors: Record<string, string> = {};

    issues.forEach((err) => {
      const key = err.path[0];

      if (typeof key === "string") {
        errors[key] = err.message;
      }
    });

    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setErrors(zodToFieldErrors(result.error.issues));
      return;
    }

    try {
      setLoading(true);
      show("Login Process...");

      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setErrors({ email: "Invalid email or password" });
        return;
      }

      // HANDLE CHECKOUT REDIRECT
      const redirect = localStorage.getItem("checkout_redirect");

      if (redirect) {
        localStorage.removeItem("checkout_redirect");
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setErrors({ email: "Login failed. Try again." });
    } finally {
      setLoading(false);
      hide();
    }
  };

  return (
    <div className=" flex items-center justify-center ">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div>
          <Link href={`/`}>
            <Image
              src={`/assets/logo/Group 87.png`}
              alt="home"
              height={60}
              width={60}
              className="mb-10 cursor-pointer"
            />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Welcome to Asian Spices 👋
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Great to see you. Sign in to access your account and get started.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-bold">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-bold">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <Link href="/reset-password">
              Reset Password
              <span className="menu-arrow inside-submenu" />
            </Link>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          {/* <span className="px-3 text-sm text-gray-400">Or</span> */}
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login link */}
        <p className="text-sm text-gray-500 mt-6 font-bold">
          Don't you have an account?&nbsp;
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-10">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

{
  /* Google Button */
}
{
  /* <button className="w-full flex items-center justify-center gap-2  py-3 rounded-lg hover:bg-gray-50 transition bg-white">
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="text-sm font-medium text-gray-700">
            Sign in with Google
          </span>
        </button> */
}
