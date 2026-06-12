import pg from "pg";
export declare const pool: import("pg").Pool;
/**
 * Executes a type-safe raw PostgreSQL query using the connection pool
 * @param text The SQL query string (e.g., 'SELECT * FROM users WHERE id = $1')
 * @param params Array of dynamic query arguments matching placeholders
 */
export declare function runQuery<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>>;
type SqlBuildResult = {
    text: string;
    values: any[];
};
/**
 * Build INSERT query dynamically
 */
export declare function buildInsertQuery(table: string, data: Record<string, unknown>): SqlBuildResult;
/**
 * Build UPDATE query dynamically
 */
export declare function buildUpdateQuery(table: string, data: Record<string, unknown>, where: {
    column: string;
    value: any;
}): SqlBuildResult;
export type { QueryResult, QueryResultRow } from "pg";
//# sourceMappingURL=index.d.ts.map