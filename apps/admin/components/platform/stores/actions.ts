// apps/admin/app/(platform)/platform/stores/actions.ts
"use server";

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";

export async function updateStore(
  storeId: string,
  data: { name: string; status: string },
) {
  const user = await requirePlatformAdmin();

  await pool.query(
    `
    UPDATE stores
    SET name = $1, status = $2
    WHERE id = $3
    `,
    [data.name, data.status, storeId],
  );

  await logAudit({
    actorId: user.id,
    action: "store.update",
    entity: "store",
    entityId: storeId,
    metadata: data,
  });

  revalidatePath("/platform/stores");
  revalidatePath(`/platform/stores/${storeId}`);
}

export async function deleteStore(storeId: string) {
  const user = await requirePlatformAdmin();

  await pool.query(`DELETE FROM stores WHERE id = $1`, [storeId]);

  await logAudit({
    actorId: user.id,
    action: "store.delete",
    entity: "store",
    entityId: storeId,
  });

  revalidatePath("/platform/stores");
}

export async function createStore(formData: FormData) {
  const platformUser = await requirePlatformAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const adminName = formData.get("adminName") as string;
  const adminEmail = formData.get("adminEmail") as string;
  const adminPassword = formData.get("adminPassword") as string;

  if (!name || !slug || !adminEmail || !adminPassword) {
    throw new Error("Missing required fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Create Store
    const storeRes = await client.query(
      `INSERT INTO stores (name, slug, status)
       VALUES ($1, $2, 'active')
       RETURNING id`,
      [name, slug],
    );

    const storeId = storeRes.rows[0].id;

    // 2️⃣ Create User
    const passwordHash = await hash(adminPassword, 10);

    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [adminEmail, passwordHash, adminName],
    );

    const userId = userRes.rows[0].id;

    // 3️⃣ Get Store Admin Role
    const roleRes = await client.query(
      `SELECT id FROM roles WHERE key = 'admin' AND scope = 'store'`,
    );

    const roleId = roleRes.rows[0].id;

    // 4️⃣ Assign User to Store
    await client.query(
      `INSERT INTO store_users (store_id, user_id, role_id)
       VALUES ($1, $2, $3)`,
      [storeId, userId, roleId],
    );

    await client.query("COMMIT");

    revalidatePath("/platform/stores");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
/* export async function createStore(formData: FormData) {
  const user = await requirePlatformAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const ownerUserId = formData.get("ownerUserId") as string;

  if (!name || !slug || !ownerUserId) {
    throw new Error("Missing required fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
      INSERT INTO stores (name, slug, status)
      VALUES ($1, $2, 'active')
      RETURNING id
      `,
      [name, slug],
    );

    const storeId = rows[0].id;

    const roleRes = await client.query(
      `SELECT id FROM roles WHERE key = 'admin' AND scope = 'store'`,
    );

    await client.query(
      `
      INSERT INTO store_users (store_id, user_id, role_id)
      VALUES ($1, $2, $3)
      `,
      [storeId, ownerUserId, roleRes.rows[0].id],
    );

    await logAudit({
      actorId: user.id,
      action: "store.create",
      entity: "store",
      entityId: storeId,
      metadata: { name, slug },
    });

    await client.query("COMMIT");

    revalidatePath("/platform/stores");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
} */

export async function setStoreStatus(
  storeId: string,
  status: "active" | "suspended",
) {
  const user = await requirePlatformAdmin();

  await pool.query(`UPDATE stores SET status = $1 WHERE id = $2`, [
    status,
    storeId,
  ]);

  await logAudit({
    actorId: user.id,
    action: `store.${status}`,
    entity: "store",
    entityId: storeId,
  });

  revalidatePath("/platform/stores");
  //   revalidatePath(`/stores/${storeId}`);
}

export async function saveStore(
  storeId: string | undefined,
  formData: FormData,
) {
  await requirePlatformAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const status = formData.get("status") as string;

  const adminName = formData.get("adminName") as string | null;
  const adminEmail = formData.get("adminEmail") as string | null;
  const adminPassword = formData.get("adminPassword") as string | null;

  if (!name || !slug) {
    throw new Error("Missing required fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let finalStoreId = storeId;

    // 1️⃣ CREATE OR UPDATE STORE
    if (storeId) {
      await client.query(
        `UPDATE stores SET name = $1, slug = $2, status = $3 WHERE id = $4`,
        [name, slug, status, storeId],
      );
    } else {
      const storeRes = await client.query(
        `INSERT INTO stores (name, slug, status)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [name, slug, status ?? "active"],
      );

      finalStoreId = storeRes.rows[0].id;

      // 2️⃣ ONLY CREATE ADMIN USER WHEN CREATING STORE
      if (!adminEmail) {
        throw new Error("Admin email required");
      }

      let userId: string;

      const existingUser = await client.query(
        `SELECT id FROM users WHERE email = $1`,
        [adminEmail],
      );

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
      } else {
        if (!adminPassword) {
          throw new Error("Password required for new user");
        }

        const passwordHash = await hash(adminPassword, 10);

        const newUser = await client.query(
          `INSERT INTO users (email, password_hash, name)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [adminEmail, passwordHash, adminName],
        );

        userId = newUser.rows[0].id;
      }

      // Assign admin role
      const roleRes = await client.query(
        `SELECT id FROM roles WHERE key = 'admin' AND scope = 'store'`,
      );

      await client.query(
        `INSERT INTO store_users (store_id, user_id, role_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (store_id, user_id) DO NOTHING`,
        [finalStoreId, userId, roleRes.rows[0].id],
      );
    }

    await client.query("COMMIT");

    revalidatePath("/platform/stores");
    revalidatePath(`/platform/stores/${finalStoreId}`);

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  redirect("/platform/stores");
}

/* export async function saveStore(
  storeId: string | undefined,
  formData: FormData,
) {
  await requirePlatformAdmin();

  const data = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    status: formData.get("status"),
  };

  if (storeId) {
    await pool.query(
      `
      UPDATE stores
      SET name = $1, slug = $2, status = $3
      WHERE id = $4
      `,
      [data.name, data.slug, data.status, storeId],
    );
  } else {
    await pool.query(
      `
      INSERT INTO stores (name, slug, status)
      VALUES ($1, $2, $3)
      `,
      [data.name, data.slug, data.status],
    );
  }

  revalidatePath("/platform/stores");
  redirect("/platform/stores");
} */

// await client.query(
//   `
//   INSERT INTO subscriptions (store_id, plan_id, status)
//   VALUES ($1, $2, 'active')
//   `,
//   [storeId, defaultPlanId],
// );
