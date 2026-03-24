// apps/admin/components/platform/partners/actions.ts

"use server";

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { createStoreFromPartner } from "@/lib/services/partner.service";

export async function approvePartner(partnerId: string) {
  const user = await requirePlatformAdmin();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT * FROM partner_registration WHERE id = $1 FOR UPDATE`,
      [partnerId]
    );

    const partner = rows[0];

    if (!partner || partner.status !== "pending") {
      throw new Error("Invalid partner");
    }

    await createStoreFromPartner(partner);

    await client.query(
      `UPDATE partner_registration
       SET status = 'approved',
           reviewed_by = $1,
           reviewed_at = NOW()
       WHERE id = $2`,
      [user.id, partnerId]
    );

    await logAudit({
      actorId: user.id,
      action: "partner.approved",
      entity: "partner",
      entityId: partnerId,
    });

    await client.query("COMMIT");

    revalidatePath("/platform/partners");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function rejectPartner(
  partnerId: string,
  reason = "Rejected"
) {
  const user = await requirePlatformAdmin();

  await pool.query(
    `UPDATE partner_registration
     SET status = 'rejected',
         rejection_reason = $1,
         reviewed_by = $2,
         reviewed_at = NOW()
     WHERE id = $3`,
    [reason, user.id, partnerId]
  );

  await logAudit({
    actorId: user.id,
    action: "partner.rejected",
    entity: "partner",
    entityId: partnerId,
  });

  revalidatePath("/platform/partners");
}