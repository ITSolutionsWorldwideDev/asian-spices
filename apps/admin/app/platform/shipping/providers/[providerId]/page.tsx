// apps/admin/app/platform/shipping/providers/[providerId]/page.tsx

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import ProviderForm from "./ProviderForm";

export default async function EditProviderPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  await requirePlatformAdmin();

  const { providerId } = await params;

  const { rows } = await pool.query(
    `
    SELECT id, name, slug, is_active
    FROM shipping_providers
    WHERE id = $1
    `,
    [providerId]
  );

  const provider = rows[0];

  if (!provider) {
    return <p>Provider not found</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <ProviderForm provider={provider} />
      </div>
    </div>
  );
}