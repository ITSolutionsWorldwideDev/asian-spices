// apps/admin/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
// import { adminAuthOptions } from "@acme/auth/admin";
import { adminAuthOptions } from "@acme/auth";

const handler = NextAuth(adminAuthOptions);
export { handler as GET, handler as POST };
