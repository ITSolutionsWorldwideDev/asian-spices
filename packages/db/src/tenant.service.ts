// packages/db/src/tenant.service.ts
import { runQuery } from "./client";
import { buildUpdateQuery } from "./sqlHelpers";

const TABLE = "tenants";

export async function updateTenantById(
  tenantId: string,
  data: Record<string, any>
) {
  const { text, values } = buildUpdateQuery(
    TABLE,
    data,
    {
      column: "id",
      value: tenantId,
    }
  );

  const result = await runQuery(text, values);
  return result.rows[0];
}

export async function getTenantById(tenantId: string) {
  const result = await runQuery(
    `SELECT * FROM ${TABLE} WHERE id = $1 LIMIT 1`,
    [tenantId]
  );

  return result.rows[0];
}