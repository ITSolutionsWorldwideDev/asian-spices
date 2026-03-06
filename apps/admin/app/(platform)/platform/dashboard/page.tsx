// apps/admin/app/(platform)/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { adminAuthOptions } from "@acme/auth/admin";
import Link from "next/link";

/**
 * Platform (Super Admin) Dashboard
 * Visible only to platform admins / owners
 */
export default async function PlatformDashboard() {
  const session = await getServerSession(adminAuthOptions);

  // console.log('session ==== ',session);

  if (!session) {
    redirect("/login");
  }

  // console.log('session.user.isPlatformAdmin ==== ',session.user.isPlatformAdmin);

  if (session.user.isPlatformAdmin !== true) {
    redirect("/unauthorized");
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className=" bg-gray-50/50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Platform Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage stores, users, billing, and global settings.
              </p>
            </div>

            {/* Stats Grid - replaces row g-4 mb-4 */}
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

            {/* Management Grid - replaces row g-4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manage Stores Card */}
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

              {/* Manage Users Card */}
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

  /* return (
    <div className="page-wrapper">
      <div className="content">

        <div className="mb-4">
          <h1 className="custome-heading">Platform Dashboard</h1>
          <p className="text-muted">
            Manage stores, users, billing, and global settings
          </p>
        </div>


        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6>Total Stores</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6>Active Subscriptions</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6>Monthly Revenue</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6>Platform Users</h6>
                <h3>—</h3>
              </div>
            </div>
          </div>
        </div>


        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5>Stores</h5>
                <p className="text-muted">
                  Create, suspend, and manage tenant stores.
                </p>
                <a href="/platform/stores" className="btn btn-primary">
                  Manage Stores
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5>Users & Roles</h5>
                <p className="text-muted">
                  Control platform admins and permissions.
                </p>
                <a href="/platform/users" className="btn btn-primary">
                  Manage Users
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); */
}
