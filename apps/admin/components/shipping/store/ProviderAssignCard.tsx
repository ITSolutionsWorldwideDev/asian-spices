//// apps/admin/components/shipping/store/ProviderAssignCard.tsx
"use client";

import { useState } from "react";

export default function ProviderAssignCard({
  storeId,
  provider,
  assignment,
  onUpdate,
}: any) {
  const [enabled, setEnabled] = useState(assignment?.is_enabled || false);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "/api/platform/shipping/store-providers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId,
            providerId: provider.id,
            is_enabled: enabled,
            apiKey,
            apiSecret,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        onUpdate(data.assignment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{provider.name}</h3>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enabled
        </label>
      </div>

      {/* Credentials */}
      {enabled && (
        <div className="space-y-3">
          <input
            placeholder="API Key (optional override)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            placeholder="API Secret"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}