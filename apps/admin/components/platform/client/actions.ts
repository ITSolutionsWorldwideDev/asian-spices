// apps/admin/app/(platform)/client/actions.ts

"use server";

import { pool } from "@acme/db";
import { revalidatePath } from "next/cache";
import { requirePlatformAdminServer } from "@/lib/auth/server-guards";

export async function createUser(data: {
  email: string;
  name?: string;
  password: string;
  is_platform_admin?: boolean;
  status?: "active" | "suspended";
}) {
  const actor = await requirePlatformAdminServer();

  const { rows } = await pool.query(
    `INSERT INTO users (email, name, password_hash, is_platform_admin, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      data.email,
      data.name,
      data.password, // hash later
      data.is_platform_admin ?? false,
      data.status ?? "active",
    ]
  );

  await pool.query(
    `INSERT INTO user_audit_logs (user_id, action, actor_id, changes)
     VALUES ($1, 'created', $2, $3)`,
    [rows[0].id, actor.id, JSON.stringify(data)]
  );

  revalidatePath("/users");
}

export async function updateUser(userId: string, data: any) {
  const actor = await requirePlatformAdminServer();

  await pool.query(
    `UPDATE users SET email = $1 WHERE id = $2`,
    [data.email, userId]
  );

  await pool.query(
    `INSERT INTO user_audit_logs (user_id, action, actor_id)
     VALUES ($1, 'updated', $2)`,
    [userId, actor.id]
  );

  revalidatePath("/users");
}


/* import { revalidatePath } from "next/cache";
import { pool, buildInsertQuery, buildUpdateQuery } from "@acme/db";
import { requirePlatformAdminServer } from "@/lib/auth/server-guards";

export async function createUser(data: {
  email: string;
  name?: string;
  password: string;
  is_platform_admin?: boolean;
  status?: "active" | "suspended";
  roleId?: string;
  actorId: string;
}) {
  await requirePlatformAdminServer();

  // Insert user
  const { text, values } = buildInsertQuery("users", {
    email: data.email,
    name: data.name,
    password_hash: data.password, // hash in production
    is_platform_admin: data.is_platform_admin ?? false,
    status: data.status ?? "active",
  });

  const { rows } = await pool.query(text, values);
  const userId = rows[0].id;

  // Assign role if provided
  if (data.roleId) {
    await pool.query(
      `INSERT INTO store_users (user_id, role_id) VALUES ($1, $2)`,
      [userId, data.roleId]
    );
  }

  // Audit log
  await pool.query(
    `INSERT INTO user_audit_logs (user_id, action, actor_id, changes)
     VALUES ($1, 'created', $2, $3)`,
    [userId, data.actorId, JSON.stringify(data)]
  );

  // Revalidate pages if using caching
  revalidatePath("/users");

  return rows[0];
} */

/* export async function updateUser(userId: string, data: {
  email?: string;
  name?: string;
  password?: string;
  is_platform_admin?: boolean;
  status?: "active" | "suspended";
  roleId?: string;
  actorId: string;
}) {
  await requirePlatformAdmin();

  // Update user
  const updateData: any = { ...data };
  if (data.password) {
    updateData.password_hash = data.password;
    delete updateData.password;
  }
  delete updateData.actorId;
  delete updateData.roleId;

  const { text, values } = buildUpdateQuery("users", updateData, {
    column: "id",
    value: userId,
  });

  const { rows } = await pool.query(text, values);

  // Update role if provided
  if (data.roleId) {
    await pool.query(
      `UPDATE store_users SET role_id = $1 WHERE user_id = $2`,
      [data.roleId, userId]
    );
  }

  // Audit log
  await pool.query(
    `INSERT INTO user_audit_logs (user_id, action, actor_id, changes)
     VALUES ($1, 'updated', $2, $3)`,
    [userId, data.actorId, JSON.stringify(data)]
  );

  revalidatePath("/users");

  return rows[0];
}
 */