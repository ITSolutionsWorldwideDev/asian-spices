// packages/auth/index.ts

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { runQuery } from "@acme/db";
import * as bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        // console.log('credentials ==== ',credentials);

        // Fetch user from PostgreSQL
        const query = `SELECT id, email, password_hash, role FROM users WHERE email = $1 LIMIT 1`;
        const result = await runQuery(query, [credentials.email]);

        if (result.rowCount === 0) {
          throw new Error("User not found");
        }

        const user = result.rows[0];

        // Compare hash
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if ("role" in user && user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user ?? ({} as any);
        const user = session.user as {
          id: string;
          role?: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
        };

        user.id = token.id!;
        user.role = token.role;
        session.user = user;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

import { getServerSession } from "next-auth";

export const auth = () => getServerSession(authOptions);
