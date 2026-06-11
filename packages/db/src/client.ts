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
    // connectionString: process.env.DATABASE_URL,
    connectionString: process.env.DATABASE_URL,
    max: 2,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV === "development") {
  pool.removeAllListeners("connect");
  pool.removeAllListeners("acquire");
  pool.removeAllListeners("remove");

  pool.on("connect", () => console.log("DB CONNECT"));
  pool.on("acquire", () => console.log("DB ACQUIRE"));
  pool.on("remove", () => console.log("DB REMOVE"));

  setInterval(() => {
    console.log({
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    });
  }, 10000);
}

if (process.env.NODE_ENV !== "production") {
  globalForPool.pool = pool;
}

// Generic parameterized query helper
// Generic parameterized query helper
export async function runQuery<T extends QueryResultRow = any>(
  query: string,
  params: any[] = [],
): Promise<QueryResult<T>> {
  ensureEnv();

  const client = await pool.connect();
  try {
    /* 🟢 THE FIX: Cast the execution result directly as a Promise return */
    return (await client.query(query, params)) as QueryResult<T>;
  } finally {
    client.release();
  }
}
/* export async function runQuery<T extends QueryResultRow = any>(
  query: string,
  params: any[] = [],
): Promise<QueryResult<T>> {
  ensureEnv();

  const client = await pool.connect();
  try {
    return await client.query<T>(query, params);
  } finally {
    client.release();
  }
}
 */