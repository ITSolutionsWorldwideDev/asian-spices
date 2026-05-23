// apps/admin/app/platform/packaging/addons/new/page.tsx

import { requirePlatformAdmin } from "@/lib/auth/guards";
import AddonForm from "./AddonForm";

export default async function NewAddonPage() {
  await requirePlatformAdmin();

  return (
    <div className="page-wrapper">
      <div className="content">
        <AddonForm />
      </div>
    </div>
  );
}
