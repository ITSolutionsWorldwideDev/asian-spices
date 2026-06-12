// packages/auth/core/callbacks.ts
export function createCallbacks(maxIdleTime) {
    return {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.email = user.email;
                token.isPlatformAdmin = user.isPlatformAdmin ?? user.is_platform_admin;
                // token.storeRoles = user.storeRoles;
                token.storeRoles = user.storeRoles?.map((role) => ({
                    store_id: role.store_id,
                    role: role.role,
                    slug: role.slug, // Map the slug here
                }));
            }
            token.lastActiveAt = token.lastActiveAt || Date.now();
            return token;
        },
        async session({ session, token }) {
            const now = Date.now();
            const lastActive = token.lastActiveAt || now;
            const expired = now - lastActive > maxIdleTime;
            if (session.user) {
                session.user.id = token.userId;
                session.user.email = token.email;
                session.user.isPlatformAdmin = !!token.isPlatformAdmin;
                session.user.storeRoles = token.storeRoles || [];
            }
            session.expired = Boolean(expired);
            return session;
        },
    };
}
