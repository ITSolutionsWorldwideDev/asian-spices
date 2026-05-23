// apps/admin/app/platform/packaging/types/new/PackagingTypeForm.tsx

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

type PackagingType = {
  id?: string;

  name?: string;

  code?: string;

  description?: string;

  width_cm?: number;

  height_cm?: number;

  length_cm?: number;

  max_weight_kg?: number;

  material?: string;

  is_fragile_safe?: boolean;

  is_active?: boolean;
};

export default function PackagingTypeForm({
  packagingType,
}: {
  packagingType?: PackagingType;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: packagingType?.name || "",

    code: packagingType?.code || "",

    description: packagingType?.description || "",

    width_cm: packagingType?.width_cm || 0,

    height_cm: packagingType?.height_cm || 0,

    length_cm: packagingType?.length_cm || 0,

    max_weight_kg: packagingType?.max_weight_kg || 0,

    material: packagingType?.material || "cardboard",

    is_fragile_safe: packagingType?.is_fragile_safe ?? false,

    is_active: packagingType?.is_active ?? true,
  });

  const handleSubmit = async () => {
    setLoading(true);

    setError("");

    try {
      const res = await fetch("/api/platform/packaging/types", {
        method: packagingType?.id ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: packagingType?.id,

          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to save packaging type");

        return;
      }

      router.push("/platform/packaging/types");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-6">
      {/* HEADER */}

      <div>
        <h2 className="text-xl font-semibold">
          {packagingType ? "Edit Packaging Type" : "Create Packaging Type"}
        </h2>

        <p className="text-sm text-gray-500">
          Configure packaging box templates
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* FORM */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NAME */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name
          </label>

          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* CODE */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Code
          </label>

          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.code}
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value,
              })
            }
          />
        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>

          <textarea
            className="w-full border rounded min-h-[120px] px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* MATERIAL */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Material
          </label>

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.material}
            onChange={(e) =>
              setForm({
                ...form,
                material: e.target.value,
              })
            }
          >
            <option value="cardboard">Cardboard</option>

            <option value="plastic">Plastic</option>

            <option value="wood">Wood</option>

            <option value="paper">Paper</option>
          </select>
        </div>

        {/* WIDTH */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Width (cm)
          </label>

          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.width_cm}
            onChange={(e) =>
              setForm({
                ...form,
                width_cm: Number(e.target.value),
              })
            }
          />
        </div>

        {/* HEIGHT */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Height (cm)
          </label>

          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.height_cm}
            onChange={(e) =>
              setForm({
                ...form,
                height_cm: Number(e.target.value),
              })
            }
          />
        </div>

        {/* LENGTH */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Length (cm)
          </label>

          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.length_cm}
            onChange={(e) =>
              setForm({
                ...form,
                length_cm: Number(e.target.value),
              })
            }
          />
        </div>

        {/* MAX WEIGHT */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Weight (kg)
          </label>

          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={form.max_weight_kg}
            onChange={(e) =>
              setForm({
                ...form,
                max_weight_kg: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* FLAGS */}

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_fragile_safe}
            onChange={(e) =>
              setForm({
                ...form,
                is_fragile_safe: e.target.checked,
              })
            }
          />
          Fragile Safe
        </label>

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
          Active
        </label>
      </div>

      {/* ACTION */}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Saving..." : "Save Packaging Type"}
      </button>
    </div>
  );
}
