// apps/web/app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/dbactions/products";

// 🔥 Clean helper (ARRAY SAFE)
const cleanArray = (arr: string[] = []) =>
  arr.filter((v) => v && v !== "" && v !== "null" && v !== "undefined");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // 🔥 Parse arrays CORRECTLY
  const subcategories = cleanArray(
    searchParams.get("subcategories")?.split(",") || []
  );

  const brands = cleanArray(
    searchParams.get("brands")?.split(",") || []
  );

  // 🔥 Build filters
  const filters = {
    category: searchParams.get("category") || "spices",
    subcategories,
    brands,
    minPrice: searchParams.get("min"),
    maxPrice: searchParams.get("max"),
    search: searchParams.get("search"),
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || "1"),
  };

  try {
    const products = await getProducts(filters);

    return NextResponse.json({
      data: products,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { data: [], error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/* import { NextResponse } from "next/server";
import { getProducts } from "@/lib/dbactions/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const filters = {
    category: searchParams.get("category"),
    page: Number(searchParams.get("page") || 1),
    subcategories: searchParams.get("subcategories")?.split(",") || [],
  };

  const data = await getProducts(filters);

  return Response.json(data);
} */

/* export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const filters = {
    category: searchParams.get("category"),
    subcategories: searchParams.get("subcategories")?.split(",") || [],
    brands: searchParams.get("brands")?.split(",") || [],
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    search: searchParams.get("search"),
  };

  const products = await getProducts(filters);

  return NextResponse.json({ success: true, data: products });
} */

/* interface path {
  path: string;
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const categoriesParam = searchParams.getAll("categories");

  try {
    const products = await getProducts(path as string, categoriesParam);
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error || "Failed to fetch products",
    });
  }
} */
