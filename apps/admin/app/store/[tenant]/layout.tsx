// apps/admin/app/store/[tenant]/layout.tsx


import StoreHeader from "@/components/store/Header";
import StoreSidebar from "@/components/store/StoreSidebar";
import { getCurrentStoreFromPath, requireStorePermission2 } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { StoreProvider } from "@/components/store-context";
import { ToastProvider } from "@repo/ui";

import "../../layout.css";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {

  const { tenant } = await params;

  const store = await requireStorePermission2(
    PERMISSIONS.VIEW_ORDERS,
    tenant,
  );

  return (
    <StoreProvider
      store={{
        id: store.id,
        name: store.name,
      }}
    >
    <ToastProvider>
      <div className="main-wrapper">
        <StoreHeader  />{/* storeId={store.id} storeName={store.name} */}
        <StoreSidebar />
        <main>{children}</main>
      </div>
    </ToastProvider>
    </StoreProvider>
  );
}
