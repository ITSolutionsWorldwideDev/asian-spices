// apps/admin/components/platform/client/UsersList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TbCirclePlus, TbTrash, TbEdit } from "react-icons/tb";

type User = {
  id: string;
  email: string;
  name?: string;
  is_platform_admin: boolean;
  status: "active" | "suspended";
  created_at: string;
};

const PAGE_SIZE = 10;

export default function UsersListComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users?page=${page}&search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setUsers(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  async function handleDelete() {
    if (!selectedUser) return;

    await fetch(`/api/users/${selectedUser}`, {
      method: "DELETE",
    });

    setShowDeleteModal(false);
    setSelectedUser(null);
    fetchUsers();
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <input
          className="input w-64"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link
          href="/platform/users/new"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <TbCirclePlus size={18} /> Add User
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Email</th>
              <th>Name</th>
              <th>Status</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{u.email}</td>
                <td>{u.name}</td>
                <td>{u.status}</td>
                <td>{u.is_platform_admin ? "Platform Admin" : "User"}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <Link href={`/users/${u.id}`} className="p-1 hover:text-blue-600">
                    <TbEdit />
                  </Link>
                  <button
                    className="p-1 hover:text-red-600"
                    onClick={() => {
                      setSelectedUser(u.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <TbTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        <span>
          Page {page} / {Math.ceil(total / PAGE_SIZE)}
        </span>

        <button
          disabled={page * PAGE_SIZE >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded text-center">
            <h4 className="font-bold mb-2">Delete user?</h4>
            <p className="mb-4 text-gray-600">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TbCirclePlus, TbTrash, TbEdit } from "react-icons/tb";
import { useToast } from "@repo/ui";

type User = {
  id: string;
  email: string;
  name?: string;
  is_platform_admin: boolean;
  status: "active" | "suspended";
  created_at: string;
};

export default function UsersListComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { showToast } = useToast();
  const PAGE_SIZE = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users?page=${page}&search=${search}`);
      const data = await res.json();
      setUsers(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`/api/users/${selectedUser}`, {
        method: "DELETE",
        body: JSON.stringify({ actorId: "currentAdminId" }),
      });
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("error", "Delete failed");
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-64"
        />
        <Link
          href="/users/new"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <TbCirclePlus size={18} /> Add User
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="w-full table-auto bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Email</th>
              <th>Name</th>
              <th>Status</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.email}</td>
                <td>{user.name}</td>
                <td>{user.status}</td>
                <td>{user.is_platform_admin ? "Platform Admin" : "User"}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <Link href={`/users/${user.id}`} className="p-1 hover:text-blue-600">
                    <TbEdit />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedUser(user.id);
                      setShowDeleteModal(true);
                    }}
                    className="p-1 hover:text-red-600"
                  >
                    <TbTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

     
      <div className="flex justify-between mt-4">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 bg-gray-200 rounded">
          Prev
        </button>
        <span>
          Page {page} / {Math.ceil(total / PAGE_SIZE)}
        </span>
        <button disabled={page * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-gray-200 rounded">
          Next
        </button>
      </div>


      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded p-6 text-center max-w-sm">
            <h4 className="font-bold mb-2">Delete User</h4>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this user?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} */
