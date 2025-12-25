// apps/admin/components/products/ProductImportModal.tsx
"use client";

import { useState } from "react";
import { Download, Upload } from "react-feather";

export default function ProductImportModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/products/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert(data.error || "Import failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h4 className="text-lg font-semibold mb-4">Import Products</h4>

        {/* Download sample file */}
        <a
          href="/assets/migration_sample/products-sample.xlsx"
          download="products-sample.xlsx"
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mb-4"
        >
          <Download size={16} className="mr-2" />
          Download Sample Excel
        </a>

        {/* Custom file upload */}
        <label className="flex items-center justify-center w-full border border-dashed border-gray-300 rounded p-4 cursor-pointer hover:bg-gray-50 mb-4">
          <Upload size={20} className="mr-2 text-gray-600" />
          {file ? (
            <span className="text-gray-800">{file.name}</span>
          ) : (
            <span className="text-gray-500">Click to select Excel file (.xlsx/.xls)</span>
          )}
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Importing..." : "Upload & Import"}
          </button>
        </div>
      </div>
    </div>
  );
}


/* "use client";

import { useState } from "react";
import { Download, Upload } from "react-feather";

export default function ProductImportModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/products/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert(data.error || "Import failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h4 className="text-lg font-semibold mb-4">Import Products</h4>


        <a
          href="/assets/migration_sample/products-sample.xlsx"
          download="products-sample.xlsx"
          className="lex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300  mb-4"
        >
            <Download size={16} className="mr-2" />
          Download Sample Excel
        </a>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border p-2 rounded my-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Importing..." : "Upload & Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
 */