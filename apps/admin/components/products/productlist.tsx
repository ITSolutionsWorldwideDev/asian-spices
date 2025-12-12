// apps/admin/components/products/productlist.tsx
"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Table from "@/core/common/pagination/datatable";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import RefreshIcon from "@/core/common/tooltip-content/refresh";
import TooltipIcons from "@/core/common/tooltip-content/tooltipIcons";
import { productlistdata } from "@/core/json/productlistdata";
import Brand from "@/core/modals/inventory/brand";
import { all_routes } from "@/data/all_routes";

import Link from "next/link";
import { Download, Edit, Eye, Trash2 } from "react-feather";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import FilterBar from "./FilterBar";

export default function ProductListComponent() {
  const dataSource = productlistdata;
  const route = all_routes;

  // Tailwind Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a: any, b: any) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (text: string, record: any) => (
        <div className="flex items-center">
          <Link href="#" className="avatar avatar-md mr-2">
            <img src={record.productImage} alt="product" />
          </Link>
          <Link href="#">{text}</Link>
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
      title: "Unit",
      dataIndex: "unit",
      sorter: (a: any, b: any) => a.unit.localeCompare(b.unit),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      sorter: (a: any, b: any) => a.qty - b.qty,
    },
    {
      title: "Created By",
      dataIndex: "createdby",
      render: (text: string, record: any) => (
        <span className="flex items-center">
          <Link href="/profile" className="mr-2">
            <img src={record.img} alt="creator" className="w-6 h-6 rounded-full" />
          </Link>
          <Link href="/profile">{text}</Link>
        </span>
      ),
      sorter: (a: any, b: any) => a.createdby.localeCompare(b.createdby),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
        <div className="flex gap-2">
          <Link href={route.productdetails} className="p-2">
            <Eye size={16} />
          </Link>
          <Link href={route.editproduct} className="p-2">
            <Edit size={16} />
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
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
      <div className="page-wrapper">
        <div className="content">
          {/* ------------------------- PAGE HEADER ------------------------- */}
          <div className="page-header flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
              <h4 className="text-lg font-semibold">Product List</h4>
              <h6 className="text-gray-500">Manage your products</h6>
            </div>

            <ul className="flex gap-2">
              <TooltipIcons />
              <RefreshIcon />
              <CollapesIcon />
            </ul>

            <div className="flex flex-wrap gap-2">
              <Link
                // href={route.addproduct}
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
              <div className="search-set"></div>
              <FilterBar />
            </div>
            {/* ------------------------- TABLE ------------------------- */}
            <div className="card-body">
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>
          </div>

          {/* <Brand /> */}
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
                onClick={() => setShowDeleteModal(false)}
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


/* import Table from "@/core/common/pagination/datatable";
import CollapesIcon from "@/core/common/tooltip-content/collapes";
import RefreshIcon from "@/core/common/tooltip-content/refresh";
import TooltipIcons from "@/core/common/tooltip-content/tooltipIcons";
import { productlistdata } from "@/core/json/productlistdata";
import Brand from "@/core/modals/inventory/brand";
import { all_routes } from "@/data/all_routes";

import Link from "next/link";
import { Download, Edit, Eye, Trash2 } from "react-feather";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import FilterBar from "./FilterBar";

export default function ProductListComponent() {
  const dataSource = productlistdata;
  const route = all_routes;

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a: any, b: any) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (text: string, record: any) => (
        <div className="flex align-items-center">
          <Link href="#" className="avatar avatar-md me-2">
            <img src={record.productImage} alt="product" />
          </Link>
          <Link href="#">{text}</Link>
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
      title: "Unit",
      dataIndex: "unit",
      sorter: (a: any, b: any) => a.unit.localeCompare(b.unit),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      sorter: (a: any, b: any) => a.qty - b.qty,
    },
    {
      title: "Created By",
      dataIndex: "createdby",
      render: (text: string, record: any) => (
        <span className="userimgname flex align-items-center">
          <Link href="/profile" className="product-img me-2">
            <img src={record.img} alt="creator" />
          </Link>
          <Link href="/profile">{text}</Link>
        </span>
      ),
      sorter: (a: any, b: any) => a.createdby.localeCompare(b.createdby),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div className="action-table-data">
          <div className="edit-delete-action flex">
            <Link className="me-2 p-2" href={route.productdetails}>
              <Eye className="feather-view" />
            </Link>
            <Link className="me-2 p-2" href={route.editproduct}>
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#delete-modal"
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h4>Product List</h4>
              <h6>Manage your products</h6>
            </div>

            <ul className="table-top-head flex gap-2">
              <TooltipIcons />
              <RefreshIcon />
              <CollapesIcon />
            </ul>

            <div className="flex flex-wrap gap-2">
              <Link
                href={route.addproduct}
                className="btn btn-primary flex align-items-center"
              >
                <TbCirclePlus className="me-1" size={18} />
                Add Product
              </Link>

              <Link
                href="#"
                className="btn btn-secondary flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#view-notes"
              >
                <Download className="me-2" />
                Import Product
              </Link>
            </div>
          </div>

          
          <div className="card table-list-card">
            <div className="card-header flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="search-set"></div>
              <FilterBar />
            </div>
            
            <div className="card-body">
              <div className="table-responsive">
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>
          </div>

          <Brand />
        </div>
      </div>

      
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center p-3">
            <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
              <TbTrash size={28} className="text-danger" />
            </span>

            <h4 className="fw-bold mb-2">Delete Product</h4>
            <p className="text-gray-6">
              Are you sure you want to delete product?
            </p>

            <div className="flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-secondary px-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary px-3" data-bs-dismiss="modal">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} */
