// apps/admin/app/platform/packaging/addons/new/AddonForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Addon = {
  id?: string;
  name?: string;
  sku?: string;
  addon_type?: string;
  description?: string;
  cost_price?: number;
  is_active?: boolean;
};

export default function AddonForm({ addon }: { addon?: Addon }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: addon?.name || "",
    sku: addon?.sku || "",
    addon_type: addon?.addon_type || "",
    description: addon?.description || "",
    cost_price: addon?.cost_price || 0,
    is_active: addon?.is_active ?? true,
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/platform/packaging/addons", {
        method: addon?.id ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: addon?.id,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to save addon");

        return;
      }

      router.push("/platform/packaging/addons");
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
          {addon ? "Edit Addon" : "Create Addon"}
        </h2>

        <p className="text-sm text-gray-500">Configure packaging addons</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Addon Name</label>

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
            placeholder="Greeting Card"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Addon SKU</label>

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
            placeholder="CARD-001"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Addon Type</label>

          <select
            value={form.addon_type}
            onChange={(e) =>
              setForm({
                ...form,
                addon_type: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select Type</option>

            <option value="card">Greeting Card</option>

            <option value="sticker">Sticker</option>

            <option value="flower">Decorative Flower</option>

            <option value="gift_wrap">Gift Wrap</option>

            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Price */}
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

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Optional addon description..."
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
        Active Addon
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Saving..." : "Save Addon"}
      </button>
    </div>
  );
}
