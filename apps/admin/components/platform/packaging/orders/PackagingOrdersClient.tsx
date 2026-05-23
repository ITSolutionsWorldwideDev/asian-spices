// apps/admin/components/platform/packaging/orders/PackagingOrdersClient.tsx

"use client";

import Link from "next/link";

export default function PackagingOrdersClient({
  orders,
  total,
  page,
  pageSize,
}: any) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Packaging Orders</h2>

          <p className="text-sm text-gray-500">
            Track packaging assignments for customer orders
          </p>
        </div>
      </div>

      {!orders.length ? (
        <div className="card">
          <div className="card-body py-10 text-center text-gray-500">
            No packaging orders found
          </div>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Store</th>
                    <th>Packaging</th>
                    <th>Ribbon</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td>#{order.order_number}</td>

                      <td>{order.store_name}</td>

                      <td>{order.packaging_name}</td>

                      <td>{order.ribbon_name || "-"}</td>

                      <td>€{Number(order.packaging_cost).toFixed(2)}</td>

                      <td>
                        <span className="badge badge-info">{order.status}</span>
                      </td>

                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
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
