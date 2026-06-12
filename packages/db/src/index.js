// packages/db/src/index.ts
import pg from "pg";
const { Pool } = pg;
// Use a global variable to preserve the connection pool across Next.js hot-reloads in development
const globalForQueryResult = globalThis;
export const pool = globalForQueryResult.pool ??
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
export async function runQuery(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        // Optional: Log queries in development mode for easier debugging
        if (process.env.NODE_ENV !== "production") {
            const duration = Date.now() - start;
            console.log(`[Database Query] executed in ${duration}ms | Rows: ${res.rowCount}`);
        }
        return res;
    }
    catch (error) {
        console.error("[Database Query Error]:", error);
        throw error;
    }
}
/**
 * Build INSERT query dynamically
 */
export function buildInsertQuery(table, data) {
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
export function buildUpdateQuery(table, data, where) {
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
