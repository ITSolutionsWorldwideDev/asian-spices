// apps/web/components/layout/signup/SignupForm.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { signIn } from "next-auth/react";

/* ---------------- ZOD SCHEMA ---------------- */
const signupSchema = z
  .object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(8, "Phone is required"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

    /* ---------------- VALIDATION ---------------- */
    const result = signupSchema.safeParse(form);

    if (!result.success) {
      setErrors(zodToFieldErrors(result.error.issues));
      return;
    }

    try {
      setLoading(true);

      /* ---------------- API CALL ---------------- */
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error || "Signup failed" });
        return;
      }

      /* ---------------- AUTO LOGIN ---------------- */
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/",
      });
    } catch (err) {
      setErrors({ email: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

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

        <div className="flex justify-center mt-6">
          <Link href="/partner-registration">
            <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white rounded-xl shadow-lg bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
              <span className="relative z-10 flex items-center gap-2 text-black cursor-pointer">
                🚀 Sign up as a partner
              </span>

              {/* Glow Effect */}
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition duration-300 rounded-xl"></span>
            </button>
          </Link>
        </div>

        {/* ================= USER FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-bold text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600">Phone No</label>
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white
                         hover:bg-slate-800 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm font-bold text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        <p className="mt-10 text-xs text-gray-400">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

// const [type, setType] = useState<"user" | "partner">("user");
{
  /* Toggle */
}
{
  /* <div className="mb-8 flex rounded-lg bg-gray-100 p-1"> */
}
{
  /* <button
            // onClick={() => setType("user")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition
              // 
                // type === "user"
                   bg-white text-gray-900 shadow
                  // : "text-gray-500"
              `}
          >
            Signup as User
          </button> */
}

{
  /* <button
            // onClick={() => setType("partner")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition
              ${
                type === "partner"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500"
              }`}
          >
            Signup as Partner
          </button> */
}
{
  /* </div> */
}
{
  /* ================= PARTNER FORM ================= */
}
{
  /* {type === "partner" && (
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
              <label className="text-sm font-bold text-gray-600">
                Username
              </label>
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
              <label className="text-sm font-bold text-gray-600">
                Password
              </label>
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
              <label className="text-sm font-bold text-gray-600">
                VAT Check
              </label>
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
        )} */
}
