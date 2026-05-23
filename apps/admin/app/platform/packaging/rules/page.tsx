// apps/admin/app/platform/packaging/rules/page.tsx

import { pool } from "@acme/db";

import { requirePlatformAdmin } from "@/lib/auth/guards";
import RulesClient from "@/components/platform/packaging/rules/RulesClient";

export default async function PackagingRulesPage() {
  await requirePlatformAdmin();

  const { rows } = await pool.query(
    `
    SELECT
      pr.id,

      pr.name,
      pr.packaging_type_id as rule_type,

      pr.min_weight_kg,
      pr.max_weight_kg,

      pr.priority,

      pr.is_active,

      pt.name as packaging_name,

      pr.created_at

    FROM packaging_rules pr

    LEFT JOIN packaging_types pt
      ON pt.id = pr.packaging_type_id

    ORDER BY pr.priority ASC,
             pr.created_at DESC
  `,
  );

  return (
    <div className="page-wrapper">
      <div className="content">
        <RulesClient rules={rows} />
      </div>
    </div>
  );
}

//   pr.min_order_amount,
//   pr.max_order_amount,
