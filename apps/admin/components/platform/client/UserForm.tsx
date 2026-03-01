// apps/admin/components/platform/client/UserForm.tsx
"use client";

import { useState, useTransition } from "react";
import { createUser, updateUser } from "@/components/platform/client/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui";

type UserFormData = {
  email: string;
  name?: string;
  password?: string;
  is_platform_admin: boolean;
  status: "active" | "suspended";
};

type Props = {
  user?: {
    id: string;
    email: string;
    name?: string;
    is_platform_admin: boolean;
    status: "active" | "suspended";
  };
};

export default function UserForm({ user }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<UserFormData>({
    email: user?.email ?? "",
    name: user?.name ?? "",
    password: "",
    is_platform_admin: user?.is_platform_admin ?? false,
    status: user?.status ?? "active",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (user) {
          await updateUser(user.id, form);
          showToast("success", "User updated");
        } else {
          if (!form.password) {
            throw new Error("Password is required");
          }

          await createUser({
            ...form,
            password: form.password,
          });

          showToast("success", "User created");
        }

        router.push("/platform/users");
        router.refresh();
      } catch (err) {
        console.error(err);
        showToast("error", "Action failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl space-y-4">
      <input
        className="input w-full form-control"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className="input w-full form-control"
        placeholder="Name"
        value={form.name ?? ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="password"
        className="input w-full form-control"
        placeholder={user ? "New password (optional)" : "Password"}
        value={form.password ?? ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required={!user}
      />

      <select
        className="input w-full form-control"
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value as "active" | "suspended" })
        }
      >
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_platform_admin}
          onChange={(e) =>
            setForm({ ...form, is_platform_admin: e.target.checked })
          }
        />
        Platform Admin
      </label>

      <button type="submit" disabled={isPending} className="btn btn-primary">
        {isPending ? "Saving..." : user ? "Update User" : "Create User"}
      </button>
    </form>
  );
}

/* 

  async function getCurrentAdminId() {
    // best practice: session endpoint
    const res = await fetch("/api/me");
    const me = await res.json();
    return me.id;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const actorId = await getCurrentAdminId();

    startTransition(async () => {
      try {
        if (user) {
          // UPDATE
          await updateUser(user.id, {
            ...form,
            actorId,
          });
          showToast("success", "User updated");
        } else {
          // CREATE
          await createUser({
            ...form,
            actorId,
          });
          showToast("success", "User created");
        }

        router.push("/users");
        router.refresh();
      } catch (err) {
        console.error(err);
        showToast("error", "Something went wrong");
      }
    });
  }; */

/* "use client";

import { useState } from "react";

type Props = {
  user?: any;
  onSubmit: (data: any) => void;
};

export default function UserForm({ user, onSubmit }: Props) {
  const [form, setForm] = useState({
    email: user?.email || "",
    name: user?.name || "",
    is_platform_admin: user?.is_platform_admin || false,
    status: user?.status || "active",
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 max-w-lg"
    >
      <input
        name="email"
        value={form.email}
        onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        className="input w-full form-control"
        required
      />
      <input
        name="name"
        value={form.name}
        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Name"
        className="input w-full form-control"
      />
      <select
        value={form.status}
        onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
        className="input w-full form-control"
      >
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_platform_admin}
          onChange={e => setForm(prev => ({ ...prev, is_platform_admin: e.target.checked }))}
        />
        Platform Admin
      </label>

      <button type="submit" className="btn btn-primary">
        {user ? "Update User" : "Create User"}
      </button>
    </form>
  );
}
 */
