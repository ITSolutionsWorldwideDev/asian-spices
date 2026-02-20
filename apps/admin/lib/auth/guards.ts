// apps/admin/lib/auth/guards.ts
import { redirect } from "next/navigation";
import { pool } from "@acme/db";
import { getSessionUser } from "./getSession";
import type { PermissionKey } from "./permissions";

/**
 * Layer 1: User must be authenticated
 */
export async function requireAuth() {
  return getSessionUser();
}

/**
 * Layer 2: Platform admin only
 */
export async function requirePlatformAdmin() {
  const user = await requireAuth();

  if (!user.isPlatformAdmin) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Layer 3: Store + permission based access
 */
/* export async function requireStorePermission(
  storeId: string,
  permission: PermissionKey
) {
  const user = await requireAuth();

  // Platform admins bypass store checks
  if (user.isPlatformAdmin) return;

  const { rowCount } = await pool.query(
    `
    SELECT 1
    FROM store_users su
    JOIN roles r ON r.id = su.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE su.user_id = $1
      AND su.store_id = $2
      AND p.key = $3
    `,
    [user.id, storeId, permission]
  );

  if (!rowCount) {
    redirect("/unauthorized");
  }
} */


export async function requireStorePermission(
  storeId: string,
  permission: PermissionKey
) {
  const user = await requireAuth();

  const storeRes = await pool.query(
    `SELECT status FROM stores WHERE id = $1`,
    [storeId]
  );

  if (!storeRes.rowCount) redirect("/not-found");

  if (storeRes.rows[0].status === "suspended") {
    redirect("/store-suspended");
  }

  if (user.isPlatformAdmin) return;

  const { rowCount } = await pool.query(
    `
    SELECT 1
    FROM store_users su
    JOIN role_permissions rp ON rp.role_id = su.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE su.user_id = $1
      AND su.store_id = $2
      AND p.key = $3
    `,
    [user.id, storeId, permission]
  );

  if (!rowCount) redirect("/unauthorized");
}
