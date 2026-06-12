// packages/auth/admin/guards.ts
/**
 * Platform-level guard
 */
export function requireSuperAdmin(session) {
    return session?.user?.isPlatformAdmin === true;
}
/**
 * Store-level role guard
 */
export function requireStoreRole(session, storeId, roles = []) {
    if (!session?.user?.storeRoles)
        return false;
    return session.user.storeRoles.some((r) => r.store_id === storeId && roles.includes(r.role));
}
