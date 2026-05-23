// apps/admin/components/platform/packaging/addons/AddonsClient.tsx

"use client";

import Link from "next/link";

export default function AddonsClient({ addons, total, page, pageSize }: any) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      {/* Header */}
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Packaging Addons</h2>

          <p className="text-sm text-gray-500">
            Manage packaging addons and optional extras
          </p>
        </div>

        <Link href="/platform/packaging/addons/new" className="btn btn-primary">
          Add Addon
        </Link>
      </div>

      {/* Empty */}
      {!addons.length ? (
        <div className="card">
          <div className="card-body py-10 text-center text-gray-500">
            No addons found
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {addons.map((addon: any) => (
                    <tr key={addon.id}>
                      <td>{addon.name}</td>

                      <td>{addon.sku}</td>

                      <td className="capitalize">{addon.addon_type}</td>

                      <td>€{Number(addon.cost_price).toFixed(2)}</td>

                      <td>
                        <span
                          className={`badge ${
                            addon.is_active ? "badge-success" : "badge-error"
                          }`}
                        >
                          {addon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <Link
                          href={`/platform/packaging/addons/${addon.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({
              length: totalPages,
            }).map((_, i) => (
              <Link
                key={i}
                href={`?page=${i + 1}`}
                className={`px-3 py-1 rounded ${
                  page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
