// apps/admin/app/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { adminAuthOptions } from "@acme/auth/admin";

export default async function Home() {
  const session = await getServerSession(adminAuthOptions);

  if (!session) redirect("/login");

  if (session?.user?.isPlatformAdmin) {
    redirect("/dashboard");
  }

  const firstStore = session?.user?.storeRoles?.[0]?.store_id;
  if (firstStore) {
    redirect(`/${firstStore}/dashboard`);
  }

  redirect("/dashboard");
  // redirect("/admin/dashboard");
}
