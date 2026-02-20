// apps/admin/lib/auth/get-admin-session.ts
import { getServerSession } from "next-auth";
import { adminAuthOptions } from "@acme/auth";

export async function getAdminSession() {
  return getServerSession(adminAuthOptions);
}
