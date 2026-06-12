import type { Session } from "next-auth";
/**
 * User must be logged in
 */
export declare function requireAuth(session: Session | null): boolean;
/**
 * User must be a customer of a store
 */
export declare function requireCustomer(session: Session | null, storeId: string): boolean | undefined;
