// apps/admin/app/(platform)/stores/new/page.tsx
import StoreForm from "../[storeId]/StoreForm";

export default function NewStorePage() {
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <StoreForm />
        </div>
      </div>
    </>
  );
}

/* import { createStore } from "../actions";
import { requirePlatformAdmin } from "@/lib/auth/guards";

export default async function NewStorePage() {
  await requirePlatformAdmin();

  return (
    <form action={createStore} className="space-y-4 max-w-lg">
      <input name="name" placeholder="Store name" className="input w-full form-control" />
      <input name="slug" placeholder="store-slug" className="input w-full form-control" />
      <input
        name="ownerUserId"
        placeholder="Owner User ID"
        className="input w-full form-control"
      />

      <button className="btn btn-primary">Create Store</button>
    </form>
  );
} */
