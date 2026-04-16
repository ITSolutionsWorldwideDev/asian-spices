// apps/admin/app/api/platform/shipping/providers/test-connection/route.ts

import { NextRequest, NextResponse } from "next/server";
import { testCheapCargoConnection } from "@/lib/shipping/providers/cheapcargo";

export async function POST(req: NextRequest) {
  try {
    const { slug, apiKey, apiSecret } = await req.json();

    if (!slug || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: "Missing credentials" },
        { status: 400 },
      );
    }

    let result;

    switch (slug) {
      case "cheapcargo":
        result = await testCheapCargoConnection(apiKey, apiSecret);
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Unsupported provider" },
          { status: 400 },
        );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Test connection error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
