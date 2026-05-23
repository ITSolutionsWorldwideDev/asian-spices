// apps/admin/components/platform/packaging/rules/RulesClient.tsx

"use client";

export default function RulesClient({ rules }: any) {
  return (
    <>
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Packaging Rules</h2>

          <p className="text-sm text-gray-500">
            Configure automatic package selection logic
          </p>
        </div>

        <button className="btn btn-primary">Add Rule</button>
      </div>

      {!rules.length ? (
        <div className="card">
          <div className="card-body py-10 text-center text-gray-500">
            No packaging rules found
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rule Type</th>
                  <th>Packaging</th>
                  <th>Weight Range</th>
                  <th>Amount Range</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rules.map((rule: any) => (
                  <tr key={rule.id}>
                    <td>{rule.name}</td>

                    <td className="capitalize">{rule.rule_type}</td>

                    <td>{rule.packaging_name}</td>

                    <td>
                      {rule.min_weight_kg}
                      kg - {rule.max_weight_kg}
                      kg
                    </td>

                    <td>
                      {/* €{rule.min_order_amount} - €{rule.max_order_amount} */}
                    </td>

                    <td>{rule.priority}</td>

                    <td>
                      <span
                        className={`badge ${
                          rule.is_active ? "badge-success" : "badge-error"
                        }`}
                      >
                        {rule.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
