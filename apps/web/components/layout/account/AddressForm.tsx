// apps/web/components/layout/account/AddressForm.tsx

"use client";

import { addressSchema } from "@/lib/validation/account";
import { useZodForm } from "@acme/utils";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/form/getErrorMessage";

export default function AddressForm({
  initialData,
  onSuccess,
  addressId,
}: any) {
  const isEdit = Boolean(addressId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(addressSchema, initialData);

  const onSubmit = async (data: any) => {
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
      alert("Saved successfully");
      onSuccess?.();
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Label"
          error={getErrorMessage(errors.label)}
        >
          <Input {...register("label")} placeholder="Home / Office" />
        </FormField>

        <FormField
          label="Country"
          error={getErrorMessage(errors.country)}
        >
          <Input {...register("country")} />
        </FormField>
      </div>

      <FormField
        label="Address Line 1"
        error={getErrorMessage(errors.address_line1)}
      >
        <Input {...register("address_line1")} />
      </FormField>

      <FormField
        label="City"
        error={getErrorMessage(errors.city)}
      >
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

/* "use client";

import { addressSchema } from "@/lib/validation/account";
import { useZodForm } from "@acme/utils";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/form/getErrorMessage";

export default function AddressForm({
  initialData,
  onSuccess,
  addressId,
}: any) {
  const isEdit = Boolean(addressId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(addressSchema, initialData);

  const onSubmit = async (data: any) => {
    const res = await fetch(
      isEdit
        ? `/api/account/addresses/${addressId}`
        : `/api/account/addresses`,
      {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(data),
      },
    );

    if (res.ok) {
      alert("Saved successfully"); // replace with toast
      onSuccess?.();
    } else {
      alert("Something went wrong");
    }
  };

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

    <div className="grid md:grid-cols-2 gap-4">
      <FormField label="Label" error={errors.label?.message}>
        <Input {...register("label")} placeholder="Home / Office" />
      </FormField>

      <FormField label="Country" error={errors.country?.message}>
        <Input {...register("country")} />
      </FormField>
    </div>

    <FormField label="Address Line 1" error={errors.address_line1?.message}>
      <Input {...register("address_line1")} />
    </FormField>

    <FormField label="City" error={errors.city?.message}>
      <Input {...register("city")} />
    </FormField>

    <FormField label="Postal Code" error={errors.postal_code?.message}>
      <Input {...register("postal_code")} />
    </FormField>

    <div className="pt-4 border-t">
      <Button loading={isSubmitting}>
        {isEdit ? "Update Address" : "Create Address"}
      </Button>
    </div>

  </form>
);
} */


  /* return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input placeholder="Label" {...register("label")} />
        <p className="text-red-500">{errors.label?.message as string}</p>
      </div>

      <div>
        <input placeholder="Address Line 1" {...register("address_line1")} />
        <p className="text-red-500">
          {errors.address_line1?.message as string}
        </p>
      </div>

      <div>
        <input placeholder="City" {...register("city")} />
        <p className="text-red-500">{errors.city?.message as string}</p>
      </div>

      <div>
        <input placeholder="Postal Code" {...register("postal_code")} />
        <p className="text-red-500">
          {errors.postal_code?.message as string}
        </p>
      </div>

      <div>
        <input placeholder="Country" {...register("country")} />
        <p className="text-red-500">{errors.country?.message as string}</p>
      </div>

      <button disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
    </form>
  ); */
