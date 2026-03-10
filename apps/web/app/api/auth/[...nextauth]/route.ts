import NextAuth from "next-auth";
// import { authOptions } from "@acme/auth";
import { webAuthOptions } from "@acme/auth";

// const handler = NextAuth(authOptions);
const handler = NextAuth(webAuthOptions);

export { handler as GET, handler as POST };
