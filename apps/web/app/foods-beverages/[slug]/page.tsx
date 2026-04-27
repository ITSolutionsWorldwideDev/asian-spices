// apps/web/app/foods-beverages/[slug]/page.tsx

import SpicesProductDesc from "@/components/layout/productdescallpages/SpicesProductDesc";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function FoodAndBeveragesDetailPage({ params }: PageProps) {

  const {slug} = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  const relatedProducts = await getRelatedProducts(product.category_id);

  return (
    <SpicesProductDesc product={product} relatedProducts={relatedProducts} />
  );
}

/* import FoodAndBeverages from "@/components/layout/FoodAndBeverages/FoodAndBeverages";
import FoodAndBeveragesProductDesc from "@/components/layout/productdescallpages/FoodAndBeveragesProductDesc";
import React from "react";

const page = () => {
  return (
    <div>
      <FoodAndBeveragesProductDesc />
    </div>
  );
};

export default page;
 */