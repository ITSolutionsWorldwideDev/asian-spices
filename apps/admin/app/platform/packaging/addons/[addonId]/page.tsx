// apps/admin/app/platform/packaging/addons/[addonId]/page.tsx
import { pool } from "@acme/db";

import { requirePlatformAdmin } from "@/lib/auth/guards";

import AddonForm from "../new/AddonForm";

export default async function EditAddonPage({
  params,
}: {
  params: Promise<{
    addonId: string;
  }>;
}) {
  await requirePlatformAdmin();

  const { addonId } = await params;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM packaging_addons
    WHERE id = $1
  `,
    [addonId],
  );

  const addon = rows[0];

  if (!addon) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="card p-6">
            <p className="text-red-500">Addon not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <AddonForm addon={addon} />
      </div>
    </div>
  );
}
