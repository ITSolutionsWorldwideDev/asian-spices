// apps/admin/app/platform/products/[id]/page.tsx
// apps/admin/app/(admin)/products/[id]/page.tsx

// import AddProductComponent from "@/components/products/addproduct";
// import ProductFormComponent from "@/components/products/ProductForm";
import ProductFormComponent from "@/components/products/ProductForm.client";

interface ViewProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewProduct({ params }: ViewProductPageProps) {
  const { id } = await params;

  return <ProductFormComponent mode="view" productId={id} />;

  // return <AddProductComponent mode="view" productId={id} />;
}
