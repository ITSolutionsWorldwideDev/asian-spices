// components/layout/account/OrderStats.tsx

export default function OrderStats() {
  const stats = [
    { label: "Total Orders", value: 12 },
    { label: "Pending", value: 2 },
    { label: "Completed", value: 9 },
    { label: "Cancelled", value: 1 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border rounded-xl p-4 shadow-sm"
        >
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}