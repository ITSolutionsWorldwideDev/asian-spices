import { getProducts } from "@/lib/dbactions/products";

import { NextResponse } from "next/server";

interface path {
  path: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const categoriesParam = searchParams.getAll("categories");
  console.log("path recieved", path);
  console.log("categories recieved", categoriesParam);
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
}
