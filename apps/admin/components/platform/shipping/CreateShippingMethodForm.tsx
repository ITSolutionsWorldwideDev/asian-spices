// apps/admin/components/platform/shipping/CreateShippingMethodForm.tsx

"use client";

import { useState, useTransition } from "react";
import { ArrowLeft } from "react-feather";
import Link from "next/link";

// type Props = {
//   method?: any;
//   providers: any[];
//   onSubmit: (data: any) => Promise<void>;
// };

type Props = {
  method?: any;
  providers: any[];
};

export default function CreateShippingMethodForm({
  method,
  providers,
}: Props) {
  const isEdit = !!method;
  const [pending, startTransition] = useTransition();

  // -------------------------
  // form state
  // -------------------------
  const [name, setName] = useState(method?.name || "");
  const [code, setCode] = useState(method?.code || "");
  const [providerId, setProviderId] = useState(method?.provider_id || "");
  const [type, setType] = useState(method?.type || "api");
  const [isActive, setIsActive] = useState(method?.is_active ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // -------------------------
  // validation
  // -------------------------
  const validate = () => {
    const err: Record<string, string> = {};

    if (!name.trim()) err.name = "Name is required";
    if (!code.trim()) err.code = "Code is required";
    if (!providerId) err.providerId = "Provider is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -------------------------
  // submit
  // -------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/platform/shipping/shipping-methods", {
          method: method ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: method?.id,
            name,
            code,
            provider_id: providerId,
            type,
            is_active: isActive,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        alert("Saved successfully");
      } catch (err: any) {
        alert(err.message);
      }
    });
  };
  /* const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    startTransition(async () => {
      await onSubmit({
        id: method?.id,
        name,
        code,
        provider_id: providerId,
        type,
        is_active: isActive,
      });
    });
  };
 */
  return (
    <div className="mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Shipping Method" : "Create Shipping Method"}
            </h4>
            <p className="text-sm text-gray-500">
              Configure shipping method and provider mapping
            </p>
          </div>

          {/* <Link
            href="/platform/shipping/methods"
            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link> */}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Method Name <span className="text-red-500">*</span>
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g. DHL Express"
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Method Code <span className="text-red-500">*</span>
          </label>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg font-mono"
            placeholder="dhl_express"
          />

          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}
        </div>

        {/* Provider */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Shipping Provider <span className="text-red-500">*</span>
          </label>

          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select provider</option>
            {providers?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {errors.providerId && (
            <p className="text-red-500 text-sm mt-1">{errors.providerId}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="api">API</option>
            <option value="flat">Flat Rate</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label className="text-sm font-medium">Active</label>
        </div>

        {/* Submit */}
        <button
          disabled={pending}
          className="w-full py-3 btn btn-primary disabled:opacity-50"
        >
          {pending ? "Saving..." : isEdit ? "Update Method" : "Create Method"}
        </button>
      </form>
    </div>
  );
}

/* "use client";

import { useState } from "react";

export default function CreateShippingMethodForm({ providers }: any) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    provider_id: "",
  });

  const handleSubmit = async () => {
    await fetch("/api/platform/shipping/methods", {
      method: "POST",
      body: JSON.stringify(form),
    });

    location.reload();
  };

  return (
    <div className="space-y-3">
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Code"
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
      >
        <option>Select Provider</option>
        {providers.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}
 */
