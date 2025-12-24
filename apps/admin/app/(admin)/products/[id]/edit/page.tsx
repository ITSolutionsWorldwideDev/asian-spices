// apps/admin/app/(admin)/products/[id]/edit/page.tsx
import AddProductComponent from "@/components/products/addproduct";

interface PageProps {
  params: { id: string };
}

export default function EditProduct({ params }: PageProps) {
  return (
    <AddProductComponent
      mode="edit"
      productId={params.id}
    />
  );
}
