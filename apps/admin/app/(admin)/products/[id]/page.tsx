// apps/admin/app/(admin)/products/[id]/page.tsx
import AddProductComponent from "@/components/products/addproduct";

interface PageProps {
  params: { id: string };
}

export default function ViewProduct({ params }: PageProps) {
  return (
    <AddProductComponent
      mode="view"
      productId={params.id}
    />
  );
}
