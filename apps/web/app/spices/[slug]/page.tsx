// apps/web/app/spices/[slug]/page.tsx

import SpicesProductDesc from "@/components/layout/productdescallpages/SpicesProductDesc";
import { getProductBySlug, getRelatedProducts } from "@/lib/dbactions/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SpicesDetailPage({ params }: PageProps) {

  const {slug} = await params;

  // console.log('params.slug === ',slug);
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  const relatedProducts = await getRelatedProducts(product.category_id);

  return (
    <SpicesProductDesc product={product} relatedProducts={relatedProducts} />
  );
}

/* import SpicesProductDesc from "@/components/layout/productdescallpages/SpicesProductDesc";
import React from "react";

const spicesDetailPage = () => {
  return (
    <div>
      <SpicesProductDesc />
    </div>
  );
};

export default spicesDetailPage;
 */
