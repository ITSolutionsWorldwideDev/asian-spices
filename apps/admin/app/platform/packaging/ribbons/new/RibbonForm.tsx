// apps/admin/app/platform/packaging/ribbons/new/RibbonForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Ribbon = {
  id?: string;
  name?: string;
  sku?: string;
  color?: string;
  material?: string;
  width_mm?: number;
  cost_price?: number;
  is_active?: boolean;
};

export default function RibbonForm({ ribbon }: { ribbon?: Ribbon }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: ribbon?.name || "",
    sku: ribbon?.sku || "",
    color: ribbon?.color || "",
    material: ribbon?.material || "",
    width_mm: ribbon?.width_mm || 0,
    cost_price: ribbon?.cost_price || 0,
    is_active: ribbon?.is_active ?? true,
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/platform/packaging/ribbons", {
        method: ribbon?.id ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: ribbon?.id,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to save ribbon");

        return;
      }

      router.push("/platform/packaging/ribbons");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          {ribbon ? "Edit Ribbon" : "Create Ribbon"}
        </h2>

        <p className="text-sm text-gray-500">
          Configure decorative wrapping ribbons
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ribbon Name</label>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Luxury Gold Ribbon"
          />
        </div>

        {/* sku */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ribbon SKU</label>

          <input
            type="text"
            value={form.sku}
            onChange={(e) =>
              setForm({
                ...form,
                sku: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="GLD-RBN"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>

          <input
            type="text"
            value={form.color}
            onChange={(e) =>
              setForm({
                ...form,
                color: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Gold"
          />
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Material</label>

          <input
            type="text"
            value={form.material}
            onChange={(e) =>
              setForm({
                ...form,
                material: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Silk"
          />
        </div>

        {/* Width */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Width (mm)</label>

          <input
            type="number"
            step="0.1"
            value={form.width_mm}
            onChange={(e) =>
              setForm({
                ...form,
                width_mm: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Cost Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>

          <input
            type="number"
            step="0.01"
            value={form.cost_price}
            onChange={(e) =>
              setForm({
                ...form,
                cost_price: Number(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Active */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) =>
            setForm({
              ...form,
              is_active: e.target.checked,
            })
          }
        />
        Active Ribbon
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Saving..." : "Save Ribbon"}
      </button>
    </div>
  );
}
