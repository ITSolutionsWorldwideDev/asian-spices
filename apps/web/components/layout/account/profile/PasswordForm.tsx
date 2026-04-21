// apps/web/components/layout/account/profile/PasswordForm.tsx

"use client";

import { useZodForm } from "@acme/utils";
import { passwordSchema } from "@/lib/validation/account";

export default function PasswordForm() {
  const { register, handleSubmit, reset } = useZodForm(passwordSchema);

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/account/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error);
      return;
    }

    alert("Password updated 🔐");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10 gap-4">
      <h2 className="font-semibold text-lg">Change Password</h2>

      <div className="space-x-4 space-y-4">
        <input
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
          className="input md:w-1/2 sm:w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition bg-white"
        />

        <input
          type="password"
          placeholder="New password"
          {...register("newPassword")}
          className="input md:w-1/2 sm:w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition bg-white"
        />
        <button className="bg-orange-500 hover:bg-orange-600 md:w-1/2 sm:w-full  text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
          Update Password
        </button>
      </div>
    </form>
  );
}
