// apps/admin/app/platform/shipping/providers/[providerId]/ProviderForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { providerSchema } from "@/lib/validations/provider";
// import { getProviderAdapter } from "@/lib/shipping/providerFactory";

type Provider = {
  id?: string;
  name?: string;
  slug?: string;
  is_active?: boolean;
};

export default function ProviderForm({ provider }: { provider?: Provider }) {
  const router = useRouter();

  const [isSlugLocked, setIsSlugLocked] = useState(!!provider?.slug);

  //   const adapter = getProviderAdapter(slug);
  // const result = await adapter.testConnection({ apiKey, apiSecret });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | {
    success: boolean;
    message: string;
  }>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: provider?.name || "",
    slug: provider?.slug || "",
    is_active: provider?.is_active ?? true,

    // credentials
    apiKey: "",
    apiSecret: "",
  });

  useEffect(() => {
    setTestResult(null);
  }, [form.apiKey, form.apiSecret, form.slug]);

  useEffect(() => {
    if (!isSlugLocked) {
      setForm((prev) => ({
        ...prev,
        slug: slugify(prev.name),
      }));
    }
  }, [form.name, isSlugLocked]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setErrors({});

    // ✅ VALIDATION
    const result = providerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (field) fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/platform/shipping/providers", {
        method: provider?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: provider?.id,
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/platform/shipping/providers");
    } catch (err) {
      setError("Failed to save provider");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(
        "/api/platform/shipping/providers/test-connection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: form.slug,
            apiKey: form.apiKey,
            apiSecret: form.apiSecret,
          }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setTestResult({
          success: false,
          message: data.error || "Connection failed",
        });
      } else {
        setTestResult({
          success: true,
          message: "Connection successful ✅",
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: "Network error while testing connection",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        {provider ? "Edit Provider" : "Create Provider"}
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Slug<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            <input
              placeholder="Slug (cheapcargo)"
              disabled={isSlugLocked}
              className={`w-full px-4 py-2 border rounded-lg transition font-mono text-sm ${
                isSlugLocked
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                  : "bg-white border-blue-300 ring-2 ring-blue-100 outline-none"
              }`}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />

            <button
              type="button"
              onClick={() => setIsSlugLocked((prev) => !prev)}
              className="px-3 py-2 border rounded text-xs"
            >
              {isSlugLocked ? "Unlock" : "Lock"}
            </button>
          </div>

          {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}

          <p className="text-xs text-gray-400 mt-1">
            Used internally. Changing this may break integrations.
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">API Credentials</h3>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              API Key<span className="text-red-500 ml-1">*</span>
            </label>

            <input
              placeholder="API Key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
            />
            {errors.apiKey && (
              <p className="text-red-500 text-xs">{errors.apiKey}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              API Secret<span className="text-red-500 ml-1">*</span>
            </label>

            <input
              placeholder="API Secret"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
              value={form.apiSecret}
              onChange={(e) => setForm({ ...form, apiSecret: e.target.value })}
            />
            {errors.apiSecret && (
              <p className="text-red-500 text-xs">{errors.apiSecret}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing || !form.apiKey || !form.apiSecret || !form.slug}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test Connection"}
        </button>

        {testResult?.success && (
          <span className="text-green-600 text-xs">✔ Verified</span>
        )}

        {testResult && (
          <span
            className={`text-sm ${
              testResult.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {testResult.message}
          </span>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        Active
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
