// apps/admin/app/platform/stores/[storeId]/page.tsx


import { pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";
import StoreForm from "./StoreForm";
import StorePlanSection from "../StorePlanSection";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  await requirePlatformAdmin();

  const { storeId } = await params;

  if (!storeId) {
    throw new Error("Store ID is required");
  }


  const [{ rows: storeRows }, { rows: subscriptionRows }] =
    await Promise.all([
      pool.query(
        `SELECT id, name, slug, status FROM stores WHERE id = $1`,
        [storeId]
      ),
      pool.query(
        `
        SELECT sub.plan_id, p.name AS plan_name
        FROM subscriptions sub
        LEFT JOIN plans p ON p.id = sub.plan_id
        WHERE sub.store_id = $1
        `,
        [storeId]
      ),
    ]);

  const store = storeRows[0];

  if (!store) {
    return <p>Store not found</p>;
  }

  const subscription = subscriptionRows[0] ?? null;

  return (
    <div className="page-wrapper">
      <div className="content space-y-8">
        {/* <h1 className="text-2xl font-bold mb-6">
          Edit Store
        </h1> */}

        <StoreForm store={store} />

        <StorePlanSection
          storeId={store.id}
          currentPlanId={subscription?.plan_id ?? null}
          currentPlanName={subscription?.plan_name ?? null}
        />
      </div>
    </div>
  );
}

