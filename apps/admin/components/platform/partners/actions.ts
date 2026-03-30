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
      `SELECT * FROM partner_registration WHERE partner_id = $1 FOR UPDATE`,
      [partnerId]
    );

    const partner = rows[0];

    if (!partner) {
      throw new Error("Partner not found");
    }

    if (partner.status === "approved") {
      throw new Error("Already approved");
    }

    if (partner.status === "rejected") {
      throw new Error("Already rejected");
    }

    // if (!partner || partner.status !== "pending") {
    //   throw new Error("Invalid partner");
    // }

    const result = await createStoreFromPartner(partner);

    await client.query(
      `UPDATE partner_registration
       SET status = 'approved',
           reviewed_by = $1,
           reviewed_at = NOW()
       WHERE partner_id = $2`,
      [user.id, partnerId]
    );

    // await logAudit({
    //   actorId: user.id,
    //   action: "partner.approved",
    //   entity: "partner",
    //   entityId: partnerId,
    // });

    await logAudit({
      actorId: user.id,
      action: "partner.approved",
      entity: "partner",
      entityId: partnerId,
      metadata: {
        storeId: result.storeId,
        userId: result.userId,
      },
    });

    await client.query("COMMIT");

    /*
    await sendEmail({
      to: partner.business_email_address,
      subject: "Your store is approved 🎉",
      html: `
        <p>Hello ${partner.first_name},</p>
        <p>Your store has been approved.</p>
        <p><b>Login Email:</b> ${partner.business_email_address}</p>
        <p><b>Password:</b> ${result.tempPassword}</p>
      `,
    });
    */

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
  reason: string = "Rejected"
//   reason = "Rejected"
) {
  const user = await requirePlatformAdmin();

  if (!reason || reason.trim().length < 5) {
    throw new Error("Rejection reason is required");
  }

  const { rowCount } = await pool.query(
    `UPDATE partner_registration
     SET status = 'rejected',
         rejection_reason = $1,
         reviewed_by = $2,
         reviewed_at = NOW()
     WHERE partner_id = $3`,
    [reason, user.id, partnerId]
  );

  if (!rowCount) {
    throw new Error("Partner already processed");
  }

  await logAudit({
    actorId: user.id,
    action: "partner.rejected",
    entity: "partner",
    entityId: partnerId,
  });

  revalidatePath("/platform/partners");
  return { success: true };
}