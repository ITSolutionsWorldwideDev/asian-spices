// apps/web/components/layout/account/AddressForm.tsx

"use client";

import { addressSchema } from "@/lib/validation/account";
import { useZodForm } from "@acme/utils";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/form/getErrorMessage";
import { useState } from "react";
import { useLoaderStore } from "@/store/useLoaderStore";

export default function AddressForm({
  initialData,
  onSuccess,
  addressId,
}: any) {
  const isEdit = Boolean(addressId);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(addressSchema, initialData);

  const { show, hide } = useLoaderStore();

  const onSubmit = async (data: any) => {
    try {
      show("Saving Address...");

      const res = await fetch(
        isEdit
          ? `/api/account/addresses/${addressId}`
          : `/api/account/addresses`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (res.ok) {
        setApiError("Saved successfully");
        onSuccess?.();
      } else {
        setApiError("Something went wrong");
      }
    } catch (err: any) {
      setApiError("Error: " + err);
    } finally {
      hide();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {apiError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Label" error={getErrorMessage(errors.label)}>
          <Input {...register("label")} placeholder="Home / Office" />
        </FormField>

        <FormField label="Country" error={getErrorMessage(errors.country)}>
          <Input {...register("country")} />
        </FormField>
      </div>

      <FormField
        label="Address Line 1"
        error={getErrorMessage(errors.address_line1)}
      >
        <Input {...register("address_line1")} />
      </FormField>

      <FormField label="City" error={getErrorMessage(errors.city)}>
        <Input {...register("city")} />
      </FormField>

      <FormField
        label="Postal Code"
        error={getErrorMessage(errors.postal_code)}
      >
        <Input {...register("postal_code")} />
      </FormField>

      <div className="pt-4 border-t">
        <Button loading={isSubmitting}>
          {isEdit ? "Update Address" : "Create Address"}
        </Button>
      </div>
    </form>
  );
}