// apps/admin/app/(platform)/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { adminAuthOptions } from "@acme/auth/admin";

/**
 * Platform (Super Admin) Dashboard
 * Visible only to platform admins / owners
 */
export default async function PlatformDashboard() {
  const session = await getServerSession(adminAuthOptions);

  if (!session || session.user.isPlatformAdmin !== true) {
    redirect("/login");
  }

  return (
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
  );
}
