// apps/admin/middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ token }) {
      // block if no token
      if (!token) return false;

      // allow only admin
      return token.role === "super_admin";
    },
  },
});

// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*"],
// };
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|login|_next|static|assets|favicon.ico).*)",
  ],
};

// import { withAuth } from "next-auth/middleware";

/* export default withAuth({
  pages: {
    signIn: "/login", // redirect unauthenticated users to login
  },

  callbacks: {
    authorized({ token }) {
      // If no token → not logged in
      if (!token) return false;

      // Allow admin users only
      return token.role === "admin";
    },
  },
});
 */
/* export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|login|_next|static|assets|favicon.ico).*)",
  ],
}; */

/* import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin"
  }
});

export const config = {
  matcher: ["/dashboard/:path*"]
};
 */
