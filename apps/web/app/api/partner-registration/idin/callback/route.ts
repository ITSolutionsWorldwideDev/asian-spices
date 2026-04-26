// apps/web/app/api/partner-registration/idin/callback/route.ts

import { verifyIDIN } from "@acme/idin";
import {
  updateVerificationByReference,
  getVerificationByReference,
  updateTenantById,
} from "@acme/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const ref = searchParams.get("ref");
    const transactionId = searchParams.get("id");

    if (!ref && !transactionId) {
      return NextResponse.redirect(
        new URL("/partner-registration/failed", req.url),
      );
    }

    let verification = ref ? await getVerificationByReference(ref) : null;

    if (!verification) {
      return NextResponse.redirect(
        new URL("/partner-registration/failed", req.url),
      );
    }

    // verify via Mollie
    const result = await verifyIDIN(
      transactionId || verification.merchant_reference,
    );

    if (result.status === "success") {
      await updateVerificationByReference(ref!, {
        status: "verified",
        data: result.data,
      });

      await updateTenantById(verification.tenant_id, {
        idin_verified: true,
      });

      return NextResponse.redirect(
        new URL("/partner-registration/success", req.url),
      );
    }

    return NextResponse.redirect(
      new URL("/partner-registration/failed", req.url),
    );
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      new URL("/partner-registration/failed", req.url),
    );
  }
}
