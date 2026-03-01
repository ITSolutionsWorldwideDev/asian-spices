// apps/admin/app/(store)/layout.tsx

import StoreHeader from "@/components/store/Header";
import StoreSidebar from "@/components/store/StoreSidebar";
import { requireStorePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { ToastProvider } from "@repo/ui";

import "../layout.css";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await requireStorePermission(PERMISSIONS.VIEW_ORDERS);

  return (
    <ToastProvider>
      <div className="main-wrapper">
        <StoreHeader storeId={store.id} storeName={store.name} />
        <StoreSidebar />
        <main>{children}</main>
      </div>
    </ToastProvider>
  );
}
