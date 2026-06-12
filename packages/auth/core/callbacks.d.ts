import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
export declare function createCallbacks(maxIdleTime: number): {
    jwt({ token, user }: {
        token: JWT;
        user?: any;
    }): Promise<JWT>;
    session({ session, token }: {
        session: Session;
        token: JWT;
    }): Promise<Session>;
};
