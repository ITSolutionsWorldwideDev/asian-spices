// apps/admin/app/(platform)/platform/partners/new/page.tsx;

import StoreForm from "../../stores/[storeId]/StoreForm";

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
