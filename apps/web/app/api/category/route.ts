import { getCategories } from "@/lib/dbactions/categories";
import { error } from "console";
import { get } from "http";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error || "Failed to fetch categories",
    });
  }
}
