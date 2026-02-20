// apps/admin/app/(platform)/stores/actions.ts
"use server";

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { redirect } from "next/navigation";

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

  revalidatePath("/stores");
  revalidatePath(`/stores/${storeId}`);
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

  revalidatePath("/stores");
}

export async function createStore(formData: FormData) {
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

    // await client.query(
    //   `
    //   INSERT INTO subscriptions (store_id, plan_id, status)
    //   VALUES ($1, $2, 'active')
    //   `,
    //   [storeId, defaultPlanId],
    // );

    await logAudit({
      actorId: user.id,
      action: "store.create",
      entity: "store",
      entityId: storeId,
      metadata: { name, slug },
    });

    await client.query("COMMIT");

    revalidatePath("/stores");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

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

  revalidatePath("/stores");
  //   revalidatePath(`/stores/${storeId}`);
}

export async function saveStore(
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

  revalidatePath("/stores");
  redirect("/stores");
}
