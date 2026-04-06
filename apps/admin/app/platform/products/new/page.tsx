// apps/admin/app/platform/products/new/page.tsx
// apps/admin/app/(admin)/products/new/page.tsx

// import AddProductComponent from "@/components/products/addproduct";
// import ProductFormComponent from "@/components/products/ProductForm";
import ProductFormComponent from "@/components/products/ProductForm.client";

export default function AddProduct() {
  return (
    <>
      {/* <AddProductComponent /> */}
      <ProductFormComponent />
    </>
  );
}
