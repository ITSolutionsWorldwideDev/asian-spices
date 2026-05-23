// apps/admin/app/platform/packaging/types/[typeId]/page.tsx

import { pool } from "@acme/db";

import { requirePlatformAdmin } from "@/lib/auth/guards";
import PackagingTypeForm from "../new/PackagingTypeForm";

export default async function EditPackagingTypePage({
  params,
}: {
  params: Promise<{
    typeId: string;
  }>;
}) {
  await requirePlatformAdmin();

  const { typeId } =
    await params;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM packaging_types
    WHERE id = $1
  `,
    [typeId],
  );

  if (!rows.length) {
    return (
      <p className="p-6 text-red-500">
        Packaging type not found
      </p>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <PackagingTypeForm
          packagingType={rows[0]}
        />
      </div>
    </div>
  );
}