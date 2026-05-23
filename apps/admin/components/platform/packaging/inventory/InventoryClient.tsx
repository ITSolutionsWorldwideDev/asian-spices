// apps/admin/components/platform/packaging/inventory/InventoryClient.tsx

"use client";

import Link from "next/link";

export default function InventoryClient({
  inventory,
  total,
  page,
  pageSize,
}: any) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Packaging Inventory</h2>

          <p className="text-sm text-gray-500">
            Monitor packaging stock across partner stores
          </p>
        </div>
      </div>

      {!inventory.length ? (
        <div className="card">
          <div className="card-body py-10 text-center text-gray-500">
            No inventory found
          </div>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Packaging</th>
                    <th>Code</th>
                    <th>Quantity</th>
                    <th>Reserved</th>
                    <th>Minimum</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item: any) => {
                    const available = item.quantity - item.reserved_quantity;

                    const lowStock = available <= item.minimum_quantity;

                    return (
                      <tr key={item.id}>
                        <td>{item.store_name}</td>

                        <td>{item.packaging_name}</td>

                        <td>{item.packaging_code}</td>

                        <td>{item.quantity}</td>

                        <td>{item.reserved_quantity}</td>

                        <td>{item.minimum_quantity}</td>

                        <td>
                          <span
                            className={`badge ${
                              lowStock ? "badge-error" : "badge-success"
                            }`}
                          >
                            {lowStock ? "Low Stock" : "Healthy"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
