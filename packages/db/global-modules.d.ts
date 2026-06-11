// packages/db/global-modules.d.ts

declare module "pg" {
  export class Pool {
    constructor(config?: any);
    connect(): Promise<any>;
    query<T = any>(queryText: string, values?: any[]): Promise<any>;
    on(event: string, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string): this;
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  }
  export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
    command: string;
    oid: number;
    fields: any[];
  }
  export interface QueryResultRow {
    [column: string]: any;
  }
}