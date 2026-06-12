// packages/db/src/index.ts

import { Pool } from "pg";
import type {
  QueryResult,
  QueryResultRow
} from "pg";

// Use a global variable to preserve the connection pool across Next.js hot-reloads in development
// const globalForQueryResult = globalThis as unknown as {
//   pool?: Pool | undefined;
// };

const globalForQueryResult = globalThis as {
  pool?: Pool;
};

export const pool =
  globalForQueryResult.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optimal defaults for serverless/edge frameworks like Next.js
    max: 10, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForQueryResult.pool = pool;
}

/**
 * Executes a type-safe raw PostgreSQL query using the connection pool
 * @param text The SQL query string (e.g., 'SELECT * FROM users WHERE id = $1')
 * @param params Array of dynamic query arguments matching placeholders
 */
export async function runQuery<
  T extends QueryResultRow = QueryResultRow
>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);

    if (process.env.NODE_ENV !== "production") {
      const duration = Date.now() - start;
      console.log(
        `[Database Query] ${duration}ms | Rows: ${result.rowCount}`
      );
    }

    return result;
  } catch (error) {
    console.error("[Database Query Error]", error);
    throw error;
  }
}

type SqlBuildResult = {
  text: string;
  values: any[];
};

/**
 * Build INSERT query dynamically
 */
export function buildInsertQuery(
  table: string,
  data: Record<string, unknown>
): SqlBuildResult {
  const keys = Object.keys(data);
  const values = Object.values(data);

  return {
    text: `INSERT INTO ${table} (${keys.join(", ")})
           VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")})
           RETURNING *`,
    values,
  };
}

/**
 * Build UPDATE query dynamically
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, unknown>,
  where: {
    column: string;
    value: unknown;
  }
): SqlBuildResult {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setClause = keys
    .map((key, i) => `${key} = $${i + 2}`)
    .join(", ");

  return {
    text: `UPDATE ${table}
           SET ${setClause}
           WHERE ${where.column} = $1
           RETURNING *`,
    values: [where.value, ...values],
  };
}

// Export useful types from the pg driver directly
export type { QueryResult, QueryResultRow } from "pg";