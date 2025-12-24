// apps/admin/app/(admin)/products/[id]/page.tsx
import AddProductComponent from "@/components/products/addproduct";
interface ViewProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewProduct({ params }: ViewProductPageProps) {
  const { id } = await params;

  return <AddProductComponent mode="view" productId={id} />;
}
