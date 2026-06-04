// apps/admin/lib/shipping/resolveCredentials.ts
import { pool } from "@acme/db";
import { decrypt } from "@/lib/crypto";

export async function resolveProviderCredentials(
  providerId: string,
  storeId?: string,
) {
  const [platformRes, storeRes] = await Promise.all([
    pool.query(
      `SELECT metadata FROM shipping_provider_credentials WHERE provider_id=$1`,
      [providerId],
    ),
    storeId
      ? pool.query(
          `SELECT credentials FROM store_shipping_providers WHERE provider_id=$1 AND store_id=$2`,
          [providerId, storeId],
        )
      : Promise.resolve({ rows: [] }),
  ]);

  const decryptObject = (obj: any) => {
    if (!obj || typeof obj !== "object") return {};

    const result: Record<string, string> = {};

    for (const key of Object.keys(obj)) {
      result[key] = decrypt(obj[key]);
    }

    return result;
  };

  return {
    ...decryptObject(platformRes.rows[0]?.metadata),
    ...decryptObject(storeRes.rows[0]?.credentials),
  };
}
