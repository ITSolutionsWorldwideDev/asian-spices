// packages/auth/web/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import { credentialsProvider } from "../core/providers";
import { createCallbacks } from "../core/callbacks";
import { SESSION_IDLE_TIME } from "../core/constants";

export const webAuthOptions: NextAuthOptions = {
  providers: [
    credentialsProvider("web")
  ],

  callbacks: createCallbacks(
    SESSION_IDLE_TIME.WEB
  ),

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60 // seconds
  },

  pages: {
    signIn: "/login"
  }
};

/* import { providers } from "../core/providers";
import { callbacks } from "../core/callbacks";

import { createCallbacks } from "../core/callbacks";
import { SESSION_IDLE_TIME } from "../core/constants";

callbacks: createCallbacks(SESSION_IDLE_TIME.WEB)

export const webAuthOptions = {
  providers,
  callbacks,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60
  },
  pages: {
    signIn: "/login"
  }
}; */
