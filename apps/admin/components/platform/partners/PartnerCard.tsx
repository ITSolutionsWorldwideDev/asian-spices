// apps/admin/components/platform/partners/PartnerCard.tsx

"use client";

import Link from "next/link";
import { Check, X } from "react-feather";

export default function PartnerCard({
  partner,
  onApprove,
  onReject,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold text-sm">
            {partner.company_name}
          </h3>

          <span className="text-xs px-2 py-1 rounded bg-gray-100">
            {partner.status}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          {partner.business_email_address}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Link
          href={`/platform/partners/${partner.id}`}
          className="text-xs text-blue-600"
        >
          View
        </Link>

        {partner.status === "pending" && (
          <div className="flex gap-2">
            <button onClick={onApprove}>
              <Check size={14} />
            </button>
            <button onClick={onReject}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}