// /packages/auth/core/authorize.ts
import * as bcrypt from "bcryptjs";
import { runQuery } from "@acme/db";

export async function authorizeUser(email: string, password: string) {
  const userRes = await runQuery(
    `SELECT id, email, password_hash, is_platform_admin
     FROM users WHERE email = $1 AND status = 'active'`,
    [email]
  );

  if (userRes.rowCount === 0) throw new Error("Invalid credentials");

  const user = userRes.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error("Invalid credentials");

  const rolesRes = await runQuery(
    `SELECT su.store_id, r.key AS role
     FROM store_users su
     JOIN roles r ON r.id = su.role_id
     WHERE su.user_id = $1`,
    [user.id]
  );

  return {
    id: user.id,
    email: user.email,
    isPlatformAdmin: user.is_platform_admin,
    storeRoles: rolesRes.rows
  };
}
