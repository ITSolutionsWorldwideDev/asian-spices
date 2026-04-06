// apps/admin/app/platform/products/[id]/edit/page.tsx
// app/(admin)/products/[id]/edit/page.tsx

// import AddProductComponent from "@/components/products/addproduct";
// import ProductFormComponent from "@/components/products/ProductForm";
import ProductFormComponent from "@/components/products/ProductForm.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProduct({ params }: PageProps) {
  const { id } = await params;

  return <ProductFormComponent mode="edit" productId={id} />;
  // return <AddProductComponent mode="edit" productId={id} />;
}
