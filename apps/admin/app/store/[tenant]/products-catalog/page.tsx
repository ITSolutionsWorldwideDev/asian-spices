// apps/admin/app/store/[tenant]/products-catalog/page.tsx

import ProductsCatalogComponent from "@/components/products-catalog/ProductsCatalogComponent";

export default function ProductsCatalogPage() {
  return (
    <>
      <ProductsCatalogComponent />
    </>
  );
}

/* "use client";

import { useEffect, useState } from "react";
import AssignProductsTable from "@/components/products-catalog/AssignProductsTable";
import { CatalogProduct } from "@acme/types";
// import { CatalogProduct } from "@/types/catalog";

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);

    const res = await fetch("/api/store/catalog");
    const data = await res.json();

    setProducts(data.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    const payload = products
      .filter((p) => p.assigned)
      .map((p) => ({
        product_id: p.product_id,
        price: p.store_price,
        quantity: p.quantity,
        status: p.status,
      }));

    await fetch("/api/store/catalog/bulk", {
      method: "POST",
      body: JSON.stringify({ products: payload }),
    });

    alert("Saved successfully");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Products Catalog
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AssignProductsTable
            products={products}
            setProducts={setProducts}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Save All Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
} */