// packages/auth/core/callbacks.ts

import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export function createCallbacks(maxIdleTime: number) {
  return {
    async jwt({ token, user }: { token: JWT; user?: any }){
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.isPlatformAdmin = user.isPlatformAdmin;
        token.storeRoles = user.storeRoles;
      }

      token.lastActiveAt = Date.now();
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }){
      const expired =
        token.lastActiveAt &&
        Date.now() - token.lastActiveAt > maxIdleTime;

      session.user = {
        id: token.userId,
        email: token.email,
        isPlatformAdmin: token.isPlatformAdmin,
        storeRoles: token.storeRoles
      };

      session.expired = Boolean(expired);
      return session;
    }
  };
}


// export const callbacks = {
//   async jwt({ token, user }: { token: JWT; user?: any }) {
//     if (user) {
//       token.userId = user.id;
//       token.email = user.email;
//       token.isPlatformAdmin = user.isPlatformAdmin;
//       token.storeRoles = user.storeRoles;
//       token.lastActiveAt = Date.now();
//     }
//     return token;
//   },

//   async session({ session, token }: { session: Session; token: JWT }) {
//     const MAX_IDLE_TIME = 30 * 60 * 1000; // admin default

//     const expired =
//       token.lastActiveAt &&
//       Date.now() - token.lastActiveAt > MAX_IDLE_TIME;

//     session.user = {
//       id: token.userId,
//       email: token.email,
//       isPlatformAdmin: token.isPlatformAdmin,
//       storeRoles: token.storeRoles
//     };

//     (session as any).expired = Boolean(expired);
//     return session;
//   }
// };