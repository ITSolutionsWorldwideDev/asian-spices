// apps/admin/components/platform/partners/PartnerDetail.tsx

"use client";

import { useState } from "react";
import { approvePartner, rejectPartner } from "./actions";

export default function PartnerDetail({ partner }: any) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approvePartner(partner.partner_id);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Rejection reason required");
      return;
    }

    setLoading(true);
    try {
      await rejectPartner(partner.partner_id, reason);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🏢 COMPANY INFO */}
      <Section title="Company Info">
        <Field label="Company Name" value={partner.company_name} />
        <Field label="KVK Number" value={partner.kvk_number} />
        <Field label="VAT Number" value={partner.vat_number} />
        <Field
          label="Chamber of Commerce"
          value={partner.chamber_of_commerce_number}
        />
      </Section>

      {/* 👤 CONTACT */}
      <Section title="Contact Info">
        <Field
          label="Name"
          value={`${partner.first_name} ${partner.last_name}`}
        />
        <Field label="Email" value={partner.business_email_address} />
        <Field label="Phone" value={partner.business_phone_number} />
      </Section>

      {/* 📍 ADDRESS */}
      <Section title="Address">
        <Field
          label="Street"
          value={`${partner.street} ${partner.house_number}`}
        />
        <Field label="City" value={partner.city} />
        <Field label="Postal Code" value={partner.postal_code} />
        <Field label="Country" value={partner.country} />
      </Section>

      {/* 📄 DOCUMENTS */}
      <Section title="Documents">
        <DocumentPreview
          label="Chamber of Commerce Extract"
          files={partner.chamber_of_commerce_extract_document}
        />

        <DocumentPreview
          label="Power of Attorney"
          files={[partner.power_of_attorney_document]}
        />
      </Section>

      {/* ⚙️ STATUS */}
      <Section title="Status">
        <p className="text-sm">
          Current Status:{" "}
          <span className="font-semibold">{partner.status}</span>
        </p>

        {partner.rejection_reason && (
          <p className="text-sm text-red-500">
            Reason: {partner.rejection_reason}
          </p>
        )}
      </Section>

      {/* ✅ ACTIONS */}
      {partner.status === "pending" && (
        <div className="card p-4 space-y-3">
          <h3 className="font-semibold">Actions</h3>

          <div className="flex gap-3">
            <button
              className="btn btn-success"
              disabled={loading}
              onClick={handleApprove}
            >
              Approve
            </button>

            <button
              className="btn btn-danger"
              disabled={loading}
              onClick={handleReject}
            >
              Reject
            </button>
          </div>

          <textarea
            placeholder="Rejection reason..."
            className="w-full border p-2 text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mt-4">{label}</p>
      {/* <p className="text-sm font-medium">{value || "-"}</p> */}
      <input
        name={label}
        value={value || "-"}
        className="w-full px-4 py-2 border-none bg-gray-100 text-gray-800 cursor-not-allowed border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        disabled
      />
    </div>
  );
}

function DocumentPreview({ label, files }: any) {

  // console.log('files.length ==== ',files.length);
  if (!files || files.length === 0) {
    return (
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-400">No document uploaded</p>
      </div>
    );
  }
  // console.log('files ==== ',files);

  return (
    <div className="col-span-2 space-y-2">
      <p className="text-xs text-gray-500">{label}</p>

      <div className="flex flex-wrap gap-3">
        {files?.map((file: string, index: number) => {
          const isPdf = file?.endsWith(".pdf");

          return (
            <div key={index} className="border rounded p-2 w-40">
              {isPdf ? (
                <iframe src={file} className="w-full h-32" />
              ) : (
                <img
                  src={file}
                  alt="document"
                  className="w-full h-32 object-cover"
                />
              )}

              <a
                href={file}
                target="_blank"
                className="text-xs text-blue-600 block mt-1"
              >
                Open
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* "use client";

import { approvePartner, rejectPartner } from "./actions";

export default function PartnerDetail({ partner }: any) {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        {partner.company_name}
      </h2>

      <p>Email: {partner.business_email_address}</p>
      <p>Phone: {partner.business_phone_number}</p>
      <p>Status: {partner.status}</p>

      {partner.status === "pending" && (
        <div className="flex gap-3">
          <button
            className="btn btn-success"
            onClick={() => approvePartner(partner.partner_id)}
          >
            Approve
          </button>

          <button
            className="btn btn-danger"
            onClick={() => rejectPartner(partner.partner_id)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
} */
