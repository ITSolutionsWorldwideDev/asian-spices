// packages/auth/web/guards.ts
/**
 * User must be logged in
 */
export function requireAuth(session) {
    return Boolean(session?.user?.id);
}
/**
 * User must be a customer of a store
 */
export function requireCustomer(session, storeId) {
    return session?.user?.storeRoles?.some(r => r.store_id === storeId && r.role === "customer");
}
