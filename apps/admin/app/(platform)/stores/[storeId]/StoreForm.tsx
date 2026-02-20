// apps/admin/app/(platform)/stores/[storeId]/StoreForm.tsx
"use client";

import { useTransition } from "react";
import { saveStore } from "@/components/platform/stores/actions";

export default function StoreForm({ store }: { store?: any }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => saveStore(store?.id, formData))
      }
      className="bg-white p-6 rounded shadow max-w-xl space-y-4"
    >
      <h2 className="text-lg font-semibold">
        {store ? "Edit Store" : "Create Store"}
      </h2>

      <input
        name="name"
        defaultValue={store?.name}
        placeholder="Store name"
        className="input w-full form-control"
        required
      />

      <input
        name="slug"
        defaultValue={store?.slug}
        placeholder="store-slug"
        className="input w-full form-control"
        required
      />

      <select
        name="status"
        defaultValue={store?.status ?? "active"}
        className="input w-full form-control"
      >
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>

      <button
        disabled={pending}
        className="btn btn-primary w-full"
      >
        {pending ? "Saving..." : "Save Store"}
      </button>
    </form>
  );
}

/* "use client";

import { useTransition } from "react";
import { updateStore } from "../actions";

type Store = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended";
};

export default function StoreForm({ store }: { store: Store }) {

  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(() =>
      updateStore(store.id, {
        name: formData.get("name") as string,
        status: formData.get("status") as string
      })
    );
  }

  return (
    <form action={onSubmit} className="space-y-4 max-w-lg">
      <input name="name" defaultValue={store.name} className="input w-full form-control" />
      <select name="status" defaultValue={store.status} className="select w-full">
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>

      <button className="btn btn-primary" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
 */