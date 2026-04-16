// apps/admin/lib/shipping/providerService.ts

import { pool } from "@acme/db";
import { decrypt } from "@/lib/crypto";

export async function getProviderCredentials(slug: string) {
  const { rows } = await pool.query(
    `
    SELECT p.id, p.name, p.slug,
           c.api_key, c.api_secret
    FROM shipping_providers p
    LEFT JOIN shipping_provider_credentials c
      ON c.provider_id = p.id
    WHERE p.slug = $1 AND p.is_active = true
    `,
    [slug]
  );

  if (!rows.length) {
    throw new Error("Provider not found or inactive");
  }

  const provider = {
    id: rows[0].id,
    name: rows[0].name,
    slug: rows[0].slug,
    credentials: {} as Record<string, string>,
  };

  for (const row of rows) {
    if (row.api_key && row.api_secret) {
      provider.credentials[row.key] = decrypt(row.api_secret);
    }
  }

  return provider;
}