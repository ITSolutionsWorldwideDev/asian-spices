// apps/web/lib/validation/account.ts

import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

export const addressSchema = z.object({
  label: z.string().min(1),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postal_code: z.string().min(3),
  country: z.string().min(2),
});

/* export const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}); */
export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });
