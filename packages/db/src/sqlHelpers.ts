// packages/db/src/sqlHelpers.ts

type SqlBuildResult = {
  text: string;
  values: any[];
};

/**
 * Build INSERT query dynamically
 */
export function buildInsertQuery(
  table: string,
  data: Record<string, any>
): SqlBuildResult {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const columns = keys.join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  return {
    text: `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values,
  };
}

/**
 * Build UPDATE query dynamically
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, any>,
  where: { column: string; value: any }
): SqlBuildResult {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setClause = keys
    .map((key, i) => `${key} = $${i + 2}`)
    .join(", ");

  return {
    text: `UPDATE ${table} SET ${setClause} WHERE ${where.column} = $1 RETURNING *`,
    values: [where.value, ...values],
  };
}
