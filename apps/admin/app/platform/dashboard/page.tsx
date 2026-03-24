// apps/admin/app/platform/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { adminAuthOptions } from "@acme/auth/admin";
import Link from "next/link";
import { getPlatformDashboardData } from "@/lib/services/platformDashboard";

/**
 * Platform (Super Admin) Dashboard
 * Visible only to platform admins / owners
 */



export default async function PlatformDashboard() {
  const session = await getServerSession(adminAuthOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.isPlatformAdmin !== true) {
    redirect("/unauthorized");
  }

  const data = await getPlatformDashboardData();

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="bg-gray-50/50 p-6">
          <div className="max-w-7xl mx-auto">
      
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Platform Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage stores, users, billing, and global settings.
              </p>
            </div>

       
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Stores", value: data.totalStores },
                {
                  label: "Active Subscriptions",
                  value: data.activeSubscriptions,
                },
                {
                  label: "Total Revenue",
                  value: `$${data.totalRevenue}`,
                },
                { label: "Platform Users", value: data.totalUsers },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h6 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </h6>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </h3>
                </div>
              ))}
            </div>

       
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h6 className="text-xs text-gray-500">
                  Total Partner Applications
                </h6>
                <h3 className="text-2xl font-bold mt-2">
                  {data.totalPartners}
                </h3>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h6 className="text-xs text-gray-500">
                  Pending Approvals
                </h6>
                <h3 className="text-2xl font-bold mt-2 text-yellow-600">
                  {data.pendingPartners}
                </h3>
              </div>
            </div>

    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border rounded-xl p-8 shadow-sm">
                <h5 className="text-lg font-bold">Stores</h5>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Manage tenant stores.
                </p>
                <Link href="/platform/stores" className="btn btn-primary">
                  Manage Stores
                </Link>
              </div>

              <div className="bg-white border rounded-xl p-8 shadow-sm">
                <h5 className="text-lg font-bold">Users</h5>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Manage platform users.
                </p>
                <Link href="/platform/users" className="btn btn-primary">
                  Manage Users
                </Link>
              </div>

   
              <div className="bg-white border rounded-xl p-8 shadow-sm">
                <h5 className="text-lg font-bold">Partners</h5>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Review and approve store applications.
                </p>
                <Link href="/platform/partners" className="btn btn-primary">
                  Manage Partners
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 


/* export default async function PlatformDashboard() {
  const session = await getServerSession(adminAuthOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.isPlatformAdmin !== true) {
    redirect("/unauthorized");
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className=" bg-gray-50/50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Platform Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage stores, users, billing, and global settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Stores", value: "—" },
                { label: "Active Subscriptions", value: "—" },
                { label: "Monthly Revenue", value: "—" },
                { label: "Platform Users", value: "—" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h6 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {stat.label}
                  </h6>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h5 className="text-lg font-bold text-gray-900">Stores</h5>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Create, suspend, and manage tenant stores across the platform.
                </p>
                <Link
                  href="/platform/stores"
                  className="inline-flex items-center justify-center rounded-lg btn btn-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  Manage Stores
                </Link>
              </div>

              <div className="group bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h5 className="text-lg font-bold text-gray-900">
                  Users & Roles
                </h5>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Control platform admins and manage global system permissions.
                </p>
                <Link
                  href="/platform/users"
                  className="inline-flex items-center justify-center rounded-lg btn btn-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  Manage Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} */
