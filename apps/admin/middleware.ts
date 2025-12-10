// apps/admin/middleware.ts
export { default } from "next-auth/middleware";
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

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

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
