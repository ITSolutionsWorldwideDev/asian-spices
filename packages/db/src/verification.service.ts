// packages/db/src/verification.service.ts

import { runQuery } from "./client";
import { buildInsertQuery, buildUpdateQuery } from "./sqlHelpers";

const TABLE = "verifications";

export async function createVerification(data: Record<string, any>) {
  const { text, values } = buildInsertQuery(TABLE, data);
  const result = await runQuery(text, values);
  return result.rows[0];
}

export async function updateVerificationByReference(
  merchantReference: string,
  data: Record<string, any>
) {
  const { text, values } = buildUpdateQuery(
    TABLE,
    data,
    {
      column: "merchant_reference",
      value: merchantReference,
    }
  );

  const result = await runQuery(text, values);
  return result.rows[0];
}

export async function getVerificationByReference(
  merchantReference: string
) {
  const result = await runQuery(
    `SELECT * FROM ${TABLE} WHERE merchant_reference = $1 LIMIT 1`,
    [merchantReference]
  );

  return result.rows[0];
}