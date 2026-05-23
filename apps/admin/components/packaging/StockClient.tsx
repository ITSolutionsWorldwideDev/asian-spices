// apps/admin/components/packaging/StockClient.tsx

"use client";

export default function StockClient({
  stock,
  storeId,
}: {
  stock: any[];
  storeId: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      {!stock.length ? (
        <div className="p-12 text-center text-gray-400 text-sm font-medium">
          No packaging elements allocated to this store location.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold uppercase text-xs tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Structural Layout</th>
                <th className="px-6 py-4">SKU Code</th>
                <th className="px-6 py-4">On Hand Available</th>
                <th className="px-6 py-4">Reserved Allocation</th>
                <th className="px-6 py-4">Damaged Units</th>
                <th className="px-6 py-4">Safety Limit</th>
                <th className="px-6 py-4">Alert Banner Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stock.map((item) => {
                const net =
                  Number(item.quantity || 0) -
                  Number(item.reserved_quantity || 0);
                const isLow = net <= Number(item.minimum_threshold || 0);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-gray-400">
                      {item.package_type}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.reserved_quantity}
                    </td>
                    <td className="px-6 py-4 font-medium text-rose-600">
                      {item.damaged_quantity || 0}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono">
                      {item.minimum_threshold}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                          isLow
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        }`}
                      >
                        {isLow
                          ? "Replenish Recommended"
                          : "Healthy Stock Levels"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
