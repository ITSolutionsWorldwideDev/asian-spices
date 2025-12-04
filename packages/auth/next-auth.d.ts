// packages/auth/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/adapters";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    password?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    role?: string;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

/* import NextAuth, {
  DefaultSession,
  DefaultUser,
  User as NextAuthUser,
} from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role?: string;
    password?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends NextAuthUser {
    role?: string;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
} */
