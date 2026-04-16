// lib/validation/provider.ts

import { z } from "zod";

export const providerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Only lowercase, numbers, hyphens allowed"),

  apiKey: z.string().min(3, "API Key is required"),
  apiSecret: z.string().min(3, "API Secret is required"),

  is_active: z.boolean(),
});