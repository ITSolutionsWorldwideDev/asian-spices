// app/(admin)/products/[id]/edit/page.tsx
import AddProductComponent from "@/components/products/addproduct";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProduct({ params }: PageProps) {
  const { id } = await params;

  return <AddProductComponent mode="edit" productId={id} />;
}
