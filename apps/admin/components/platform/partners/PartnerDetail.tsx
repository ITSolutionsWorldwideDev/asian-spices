// apps/admin/components/platform/partners/PartnerDetail.tsx

"use client";

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
            onClick={() => approvePartner(partner.id)}
          >
            Approve
          </button>

          <button
            className="btn btn-danger"
            onClick={() => rejectPartner(partner.id)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}