// apps/admin/components/products/productlist.tsx
"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Table from "@/core/common/pagination/datatable";
// import { productlistdata } from "@/core/json/productlistdata";
import Brand from "@/core/modals/inventory/brand";
import { all_routes } from "@/data/all_routes";

import Link from "next/link";
import { Download, Edit, Eye, Trash2 } from "react-feather";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
// import FilterBar from "./FilterBar";
import { useToast } from "@repo/ui";

/* ------------------------------------
   Types
------------------------------------ */
type Product = {
  product_id: number;
  name: string;
  sku: string;
  item_code: string;
  category: string;
  subcategory: string;
  brand: string;
  price: string;
  quantity: string;
  status: number;
};

export default function ProductListComponent() {
  // const dataSource = productlistdata;
  const route = all_routes;

  const [dataSource, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  /* ------------------------------------
       Fetch Products
    ------------------------------------ */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.items || []);
    } catch (err) {
      console.error("Failed to load Products", err);
      showToast("error", "Failed to load Products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  /* ------------------------------------
     Delete
  ------------------------------------ */
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await fetch(`/api/products?id=${selectedId}`, {
        method: "DELETE",
      });

      setShowDeleteModal(false);
      setSelectedId(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a: any, b: any) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Product",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center">
          {/* <Link href="#" className="avatar avatar-md mr-2">
            <img src={record.productImage} alt="product" />
          </Link> */}
          <Link href={`products/${record.product_id}`}>{text}</Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.product.localeCompare(b.product),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a: any, b: any) => a.brand.localeCompare(b.brand),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <div className="flex gap-2">
          <Link href={`products/${record.product_id}`} className="p-2">
            <Eye size={16} />
          </Link>
          <Link href={`products/${record.product_id}/edit`} className="p-2">
            <Edit size={16} />
          </Link>
          <button
            onClick={() => {
              setSelectedId(record.category_id);
              setShowDeleteModal(true);
            }}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="pt-0 page-wrapper">
        <div className="content">
          {/* ------------------------- PAGE HEADER ------------------------- */}
          <div className="page-header flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
              <h4 className="text-lg font-semibold">Product List</h4>
              <h6 className="text-gray-500">Manage your products</h6>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/products/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <TbCirclePlus className="mr-1" size={18} />
                Add Product
              </Link>

              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                <Download className="mr-2" />
                Import Product
              </button>
            </div>
          </div>

          {/* ------------------------- FILTER BAR ------------------------- */}
          <div className="card table-list-card mb-4">
            <div className="card-header flex flex-wrap justify-between items-center gap-3">
              {/* <div className="search-set"></div>
              <FilterBar /> */}
            </div>
            {/* ------------------------- TABLE ------------------------- */}
            <div className="card-body">
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="text-center py-6">Loading...</p>
                ) : (
                  <Table columns={columns} dataSource={dataSource} rowKey="product_id" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------- DELETE MODAL ------------------------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-3">
              <TbTrash size={28} className="text-red-600" />
            </span>
            <h4 className="text-lg font-bold mb-2">Delete Product</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------- IMPORT MODAL ------------------------- */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Brand />
          {/* <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h4 className="text-lg font-bold mb-4">Import Products</h4>
            <p className="text-gray-600 mb-4">Upload CSV or Excel file to import products.</p>
            <input type="file" className="w-full border rounded p-2 mb-4" />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Import
              </button>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
}

