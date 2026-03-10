// apps/admin/app/(store)/users/[userId]/page.tsx

import { pool } from "@acme/db";
import { headers } from "next/headers"; // Import headers
import { NextRequest } from "next/server"; // Import type
import { getCurrentStoreAPI } from "@/lib/auth/guards";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import { notFound } from "next/navigation";
import ManageUserForm from "@/components/store/users/ManageUserForm";

type Props = {
  params: Promise<{ userId: string }>;
};
export default async function EditUserPage({ params }: Props) {
  const { userId } = await params;

  const headerList = await headers();
  const req = new NextRequest(new URL("http://localhost"), { headers: headerList });
  
  // 1. Get current store context
  // This ensures the admin can only fetch users linked to THEIR store
  const store = await getCurrentStoreAPI(req); 

  console.log('userId ==== ',userId);
  console.log('store.id ==== ',store.id);

  // 2. Fetch User with an INNER JOIN to enforce store ownership
  const userRes = await pool.query(
    `SELECT u.id, u.email, u.name, u.is_platform_admin, u.status, su.role_id 
     FROM users u
     INNER JOIN store_users su ON u.id = su.user_id
     WHERE u.id = $1 AND su.store_id = $2`,
    [userId, store.id] // Added store.id check
  );

  const user = userRes.rows[0];
  
  // If the user doesn't exist OR doesn't belong to this store, 404.
  if (!user) notFound();

  // 3. Fetch roles (filtered by store if your roles are store-specific)
  const rolesRes = await pool.query(`SELECT id, key as name FROM roles WHERE scope = 'store' ORDER BY name ASC`);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-sm text-gray-500">Update permissions and account details for {user.name}.</p>
        </div>
        <ManageUserForm 
           initialData={user} 
           userId={userId} 
           roles={rolesRes.rows} 
        />
      </div>
    </div>
  );
}

/* export default async function EditUserPage({ params }: Props) {
  await requirePlatformAdmin();
  const { userId } = await params;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(userId)) {
    return notFound();
  }

  // Fetch user details
  const userRes = await pool.query(
    `SELECT id, email, name, is_platform_admin, status FROM users WHERE id = $1`,
    [userId],
  );

  const user = userRes.rows[0];
  if (!user) notFound();

  // Fetch their store assignments
  const storesRes = await pool.query(
    `SELECT store_id, role_id FROM store_users WHERE user_id = $1`,
    [userId],
  );

  // Merge the data for the Form
  const userData = {
    ...user,
    stores: storesRes.rows, // This matches the 'user.stores' expected by UserForm
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <ManageUserForm user={userData} />
      </div>
    </div>
  );
} */