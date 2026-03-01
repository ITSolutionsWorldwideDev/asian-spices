// apps/admin/app/(platform)/users/[userId]/page.tsx

import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import UserForm from "@/components/platform/client/UserForm";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function EditUserPage({ params }: Props) {
  await requirePlatformAdmin();

  const { userId } = await params;

  const { rows } = await pool.query(
    `SELECT id, email, name, is_platform_admin, status
     FROM users
     WHERE id = $1`,
    [userId],
  );

  const user = rows[0];

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>

        <UserForm user={user} />
      </div>
    </div>
  );
}
