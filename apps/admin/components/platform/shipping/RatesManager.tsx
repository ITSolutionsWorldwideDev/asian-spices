// apps/admin/components/platform/shipping/RatesManager.tsx

"use client";

import { useEffect, useState } from "react";

type Rate = {
  id?: string;
  country?: string;
  city?: string;
  min_weight?: number | "";
  max_weight?: number | "";
  price?: number | "";
};
type Countries = {
  id: number;
  name: string;
  iso2: string;
};

export default function RatesManager({
  methodId,
  initialRates = [],
}: {
  methodId: string;
  initialRates?: Rate[];
}) {
  const [rates, setRates] = useState<Rate[]>(initialRates || []);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [countries, setCountries] = useState<Countries[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries");
        const data = await res.json();

        setCountries(data);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };

    fetchCountries();
  }, []);

  //   useEffect(() => {
  //     fetch("/api/countries")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setCountries(data);
  //       });
  //   }, []);

  // ---------------------------
  // Fetch rates
  // ---------------------------
  const fetchRates = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/platform/shipping/shipping-rates?methodId=${methodId}`,
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setRates(data.rates || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Load on mount
  // ---------------------------
  useEffect(() => {
    if (initialRates.length === 0) {
      fetchRates();
    }
  }, [methodId]);

  // ---------------------------
  // Row handlers
  // ---------------------------
  //   const addRow = () => {
  //     setRates([
  //       ...rates,
  //       {
  //         country: "",
  //         city: "",
  //         min_weight: 0,
  //         max_weight: 0,
  //         price: 0,
  //       },
  //     ]);
  //   };

  const addRow = () => {
    setRates((prev) => [
      ...prev,
      {
        country: "NL",
        city: "",
        min_weight: "",
        max_weight: "",
        price: "",
      },
    ]);
  };

  //   const updateRow = (index: number, field: string, value: any) => {
  //     const updated = [...rates];
  //     updated[index] = {
  //       ...updated[index],
  //       [field]:
  //         field === "price" || field === "min_weight" || field === "max_weight"
  //           ? Number(value)
  //           : value,
  //     };
  //     setRates(updated);
  //   };

  const updateRow = (index: number, field: string, value: any) => {
    setRates((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              [field]:
                field === "price" ||
                field === "min_weight" ||
                field === "max_weight"
                  ? value === ""
                    ? ""
                    : Number(value)
                  : value,
            }
          : r,
      ),
    );
  };

  const removeRow = (index: number) => {
    setRates(rates.filter((_, i) => i !== index));
  };

  // ---------------------------
  // Save
  // ---------------------------
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      //   if (!rate.price) throw new Error("Price required");
      //   if (rate.min_weight > rate.max_weight)
      //     throw new Error("Invalid weight range");

      const res = await fetch("/api/platform/shipping/shipping-rates/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          methodId,
          rates,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      alert("Rates saved successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------
  // UI (Improved)
  // ---------------------------
  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading rates...</p>
      ) : (
        <>
          {/* Rates List */}
          <div className="space-y-4">
            {rates.map((r, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-white shadow-sm space-y-4"
              >
                {/* Row Header */}
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Rate #{i + 1}
                  </h4>

                  <button
                    onClick={() => removeRow(i)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Country */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Country
                    </label>

                    <select
                      value={r.country || (countries[0]?.iso2 ?? "NL")}
                      onChange={(e) => updateRow(i, "country", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      {countries?.map((c) => (
                        <option key={c.id} value={c.iso2}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      City (optional)
                    </label>

                    <input
                      value={r.city || ""}
                      onChange={(e) => updateRow(i, "city", e.target.value)}
                      placeholder="e.g. Amsterdam"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Weight + Price */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Min Weight (kg)
                    </label>

                    <input
                      type="number"
                      value={r.min_weight || ""}
                      onChange={(e) =>
                        updateRow(i, "min_weight", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Max Weight (kg)
                    </label>

                    <input
                      type="number"
                      value={r.max_weight || ""}
                      onChange={(e) =>
                        updateRow(i, "max_weight", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Price
                    </label>

                    <input
                      type="number"
                      value={r.price || ""}
                      onChange={(e) => updateRow(i, "price", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {rates.length === 0 && (
              <div className="text-center text-gray-400 py-8 border rounded-lg">
                No rates configured
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center border-t pt-4">
            <button onClick={addRow} className="btn btn-secondary">
              + Add Rate
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving..." : "Save Rates"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
