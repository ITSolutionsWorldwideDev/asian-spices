// apps/admin/lib/auth/getSession.ts
import { getServerSession } from "next-auth";
import { adminAuthOptions } from "@acme/auth";
// import { adminAuthOptions } from "@acme/auth/admin";
import { redirect } from "next/navigation";

export async function getSessionUser() {
  const session = await getServerSession(adminAuthOptions);

  return session?.user ?? null;

}
