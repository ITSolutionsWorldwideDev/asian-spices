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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10">
      <h2 className="font-semibold text-lg">Change Password</h2>

      <input
        type="password"
        placeholder="Current password"
        {...register("currentPassword")}
        className="input"
      />

      <input
        type="password"
        placeholder="New password"
        {...register("newPassword")}
        className="input"
      />

      <button className="btn-primary">Update Password</button>
    </form>
  );
}
