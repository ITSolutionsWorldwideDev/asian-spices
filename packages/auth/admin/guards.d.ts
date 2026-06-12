import type { Session } from "next-auth";
/**
 * Platform-level guard
 */
export declare function requireSuperAdmin(session: Session | null): boolean;
/**
 * Store-level role guard
 */
export declare function requireStoreRole(session: Session | null, storeId: string, roles?: readonly string[]): boolean;
