// packages/auth/pg-adapter.ts
import type { Adapter, AdapterUser } from "next-auth/adapters";
import { runQuery } from "@acme/db";

export function PgAdapter(): Adapter {
  return {
    async createUser(data: any) {
      const result = await runQuery<AdapterUser>(
        `INSERT INTO "User" (name, email, image, role, "emailVerified", password)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          data.name ?? null,
          data.email ?? null,
          data.image ?? null,
          (data as any).role ?? null,
          data.emailVerified ?? null,
          (data as any).password ?? null,
        ]
      );

      const user = result.rows[0];

      if (!user) {
        throw new Error("Failed to create user");
      }

      return user; // MUST always return AdapterUser
    },

    async getUser(id) {
      const result = await runQuery<AdapterUser>(
        `SELECT * FROM "User" WHERE id = $1 LIMIT 1`,
        [id]
      );
      return result.rows[0] ?? null;
    },

    async getUserByEmail(email) {
      const result = await runQuery<AdapterUser>(
        `SELECT * FROM "User" WHERE email = $1 LIMIT 1`,
        [email]
      );
      return result.rows[0] ?? null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const result = await runQuery<AdapterUser>(
        `SELECT u.*
         FROM "User" u
         JOIN "Account" a ON u.id = a."userId"
         WHERE a.provider = $1 AND a."providerAccountId" = $2
         LIMIT 1`,
        [provider, providerAccountId]
      );
      return result.rows[0] ?? null;
    },

    async linkAccount(account: any) {
      await runQuery(
        `INSERT INTO "Account" (
          "userId", type, provider, "providerAccountId",
          refresh_token, access_token, expires_at, token_type, scope,
          id_token, session_state
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ]
      );
      return account;
    },

    async createSession(session) {
      const result = await runQuery(
        `INSERT INTO "Session" ("sessionToken","userId","expires")
         VALUES ($1,$2,$3)
         RETURNING *`,
        [session.sessionToken, session.userId, session.expires]
      );
      return result.rows[0];
    },

    async getSessionAndUser(sessionToken) {
      const result = await runQuery(
        `SELECT 
           s."sessionToken", s."userId", s.expires,
           u.id, u.name, u.email, u.role, u.image, u."emailVerified"
         FROM "Session" s
         JOIN "User" u ON u.id = s."userId"
         WHERE s."sessionToken" = $1
         LIMIT 1`,
        [sessionToken]
      );

      const row = result.rows[0];
      if (!row) return null;

      return {
        session: {
          sessionToken: row.sessiontoken,
          userId: row.userid,
          expires: row.expires,
        },
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          image: row.image,
          emailVerified: row.emailverified,
        },
      };
    },

    async updateSession(session) {
      const result = await runQuery(
        `UPDATE "Session"
         SET expires = $2
         WHERE "sessionToken" = $1
         RETURNING *`,
        [session.sessionToken, session.expires]
      );

      return result.rows[0] ?? null;
    },

    async deleteSession(sessionToken) {
      await runQuery(
        `DELETE FROM "Session" WHERE "sessionToken" = $1`,
        [sessionToken]
      );
    },
  };
}


