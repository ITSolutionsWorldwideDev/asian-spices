// packages/db/src/client.ts

import { Pool, QueryResult, QueryResultRow } from "pg";

function ensureEnv() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }
}

// Pool should also be a singleton for Next.js dev mode
const globalForPool = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.pool = pool;
}

// Generic parameterized query helper
export async function runQuery<T extends QueryResultRow = any>(
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  ensureEnv();
  
  const client = await pool.connect();
  try {
    return await client.query<T>(query, params);
  } finally {
    client.release();
  }
}
/* export async function runQuery<T extends QueryResultRow = any>(
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(query, params);
    return result;
  } catch (error) {
    console.error("DB Query Error:", error);
    throw error;
  } finally {
    client.release();
  }
} */

/* import { Pool } from "pg";

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
}); */
