// apps/admin/app/platform/partners/page.tsx

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import PartnersClient from "@/components/platform/partners/PartnersClient";

const PAGE_SIZE = 9;

export default async function PartnersPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] }>;
}) {
  await requirePlatformAdmin();

  const params = searchParams ? await searchParams : {};

  const page = Number(params.page ?? 1);
  const q = params.q as string | undefined;
  const status = params.status as string | undefined;

  const offset = (page - 1) * PAGE_SIZE;

  const where: string[] = [];
  const values: any[] = [];

  if (q) {
    values.push(`%${q}%`);
    where.push(`
      (
        company_name ILIKE $${values.length}
        OR business_email_address ILIKE $${values.length}
      )
    `);
  }

  if (status) {
    values.push(status);
    where.push(`status = $${values.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `
    SELECT 
      id,
      company_name,
      business_email_address,
      status,
      created_at,
      COUNT(*) OVER() AS total
    FROM partner_registration
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
    values
  );

  const total = rows[0]?.total ?? 0;

  return (
    <div className="page-wrapper">
      <div className="content">
        <PartnersClient
          partners={rows}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          search={q || ""}
          statusFilter={status || ""}
        />
      </div>
    </div>
  );
}