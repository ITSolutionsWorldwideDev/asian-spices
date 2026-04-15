// apps/web/app/account/profile/page.tsx

import PasswordForm from "@/components/layout/account/profile/PasswordForm";
import ProfileForm from "@/components/layout/account/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-10">
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}

/* "use client";

import { useEffect } from "react";
import { useZodForm } from "@acme/utils";
import { profileSchema } from "@/lib/validation/account";

export default function ProfilePage() {
  const { register, handleSubmit, reset } = useZodForm(profileSchema);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        reset({ name: data.user.name });
      });
  }, [reset]);

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (res.ok) alert("Profile updated");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input placeholder="Name" {...register("name")} />
      <button>Save</button>
    </form>
  );
} */
