// apps/admin/app/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { adminAuthOptions } from "@acme/auth/admin";

const PLATFORM_SUBDOMAIN = "admin";

export default async function Home() {
  const session = await getServerSession(adminAuthOptions);

  if (!session) redirect("/login");

  const headersList = await headers();
  const subdomain = headersList.get("x-tenant-subdomain");
  const isPlatform = headersList.get("x-platform");

  console.log("Home subdomain === ", subdomain);

  if (isPlatform === "true") {
    redirect("/platform/dashboard");
  }

  // ✅ Platform user
  if (subdomain === PLATFORM_SUBDOMAIN) {
    redirect("/platform/dashboard");
  }

  if (subdomain && subdomain !== PLATFORM_SUBDOMAIN) {
    redirect(`/store/${subdomain}/dashboard`);
  }

  // fallback
  redirect("/login");
}

/* import { redirect } from "next/navigation";
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
} */
