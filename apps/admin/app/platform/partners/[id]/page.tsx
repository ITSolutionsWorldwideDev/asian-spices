// apps/admin/app/platform/partners/[id]/page.tsx

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import PartnerDetail from "@/components/platform/partners/PartnerDetail";

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePlatformAdmin();

  const { id } = await params;

  if (!id) {
    throw new Error("Partner ID is required");
  }

  const { rows } = await pool.query(
    `
    SELECT *
    FROM partner_registration
    WHERE id = $1
    `,
    [id]
  );

  const partner = rows[0];

  if (!partner) {
    return <p>Partner not found</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="content space-y-6">
        <PartnerDetail partner={partner} />
      </div>
    </div>
  );
}
