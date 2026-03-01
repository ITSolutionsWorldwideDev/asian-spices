// apps/admin/app/(platform)/users/page.tsx
import UsersListComponent from "@/components/platform/client/UsersList";

export default function UsersPage() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <UsersListComponent />
      </div>
    </div>
  );
}


/* "use client";

import PlatformHeader from "@/components/platform/Header";
import PlatformSidebar from "@/components/platform/Sidebar";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/admin/app/(platform)/users/api")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Users & Roles</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button className="btn btn-sm btn-primary">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
} */