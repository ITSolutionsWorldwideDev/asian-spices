// apps/web/components/layout/account/profile/ProfileForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useZodForm } from "@acme/utils";
import { profileSchema } from "@/lib/validation/account";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/form/getErrorMessage";

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(profileSchema);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data) => {
        reset({
          name: data.user.name || "",
          email: data.user.email || "",
        });
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Profile updated ✅");
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <FormField label="Full Name" error={getErrorMessage(errors.name)}>
          <Input {...register("name")} placeholder="Your name" />
        </FormField>

        <FormField label="Email">
          <Input
            {...register("email")}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </FormField>
      </div>

      <div className="pt-4 border-t">
        <Button loading={isSubmitting}>Save Changes</Button>
      </div>
    </form>
  );
}

/* return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input
          {...register("name")}
          className="input"
          placeholder="Your name"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          {...register("email")}
          disabled
          className="input bg-gray-100"
          onBlur={(e) => {
            fetch("/api/account/change-email/request", {
              method: "POST",
              body: JSON.stringify({ newEmail: e.target.value }),
            });
          }}
        />
      </div>

      <button className="btn-primary">Save Changes</button>
    </form>
  ); */
