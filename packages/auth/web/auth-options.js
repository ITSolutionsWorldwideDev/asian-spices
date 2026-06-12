import { credentialsProvider } from "../core/providers";
import { createCallbacks } from "../core/callbacks";
import { SESSION_IDLE_TIME } from "../core/constants";
export const webAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        credentialsProvider("web")
    ],
    callbacks: createCallbacks(SESSION_IDLE_TIME.WEB),
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60 // seconds
    },
    pages: {
        signIn: "/login"
    }
};
