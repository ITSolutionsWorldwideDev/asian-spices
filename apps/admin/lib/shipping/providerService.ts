// apps/admin/lib/shipping/providerService.ts

import { pool } from "@acme/db";
import { decrypt } from "@/lib/crypto";

export async function getProviderCredentials(slug: string) {
  const { rows } = await pool.query(
    `
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.is_active,
      c.metadata
    FROM shipping_providers p
    LEFT JOIN shipping_provider_credentials c
      ON c.provider_id = p.id AND c.store_id IS NULL
    WHERE p.slug = $1
    LIMIT 1
    `,
    [slug],
  ); //  AND p.is_active = true

  if (!rows.length) {
    throw new Error("Provider not found or inactive");
  }

  const row = rows[0];
  const credentials: Record<string, string> = {};

  // if (row.metadata) {
  if (row.metadata && typeof row.metadata === "object") {
    for (const key of Object.keys(row.metadata)) {
      try {
        credentials[key] = decrypt(row.metadata[key]);
      } catch (e) {
        credentials[key] = ""; // Keep things from crashing if decrypt fails
      }
    }
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    is_active: row.is_active,
    credentials,
  };
}
