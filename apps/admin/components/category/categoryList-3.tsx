// apps/admin/components/category/categoryList.tsx
"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Table from "@/core/common/pagination/datatable";
import { categorylist } from "@/core/json/categorylistdata";
import { Edit, Trash2 } from "react-feather";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import FilterBar from "./FilterBar";

type Category = {
  id: number;
  category: string;
  categoryslug: string;
  status: string;
};

export default function CategoryListComponent() {
  const [categories, setCategories] = useState<Category[]>(categorylist);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: null as number | null,
    category: "",
    categoryslug: "",
    status: true,
  });

  /* ---------------- OPEN ADD MODAL ---------------- */
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      id: null,
      category: "",
      categoryslug: "",
      status: true,
    });
    setIsModalOpen(true);
  };

  /* ---------------- OPEN EDIT MODAL ---------------- */
  const openEditModal = (record: Category) => {
    setIsEditMode(true);
    setFormData({
      id: record.id,
      category: record.category,
      categoryslug: record.categoryslug,
      status: record.status === "Active",
    });
    setIsModalOpen(true);
  };

  /* ---------------- HANDLE SUBMIT ---------------- */
  const handleSubmit = () => {
    if (isEditMode) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? {
                ...item,
                category: formData.category,
                categoryslug: formData.categoryslug,
                status: formData.status ? "Active" : "Inactive",
              }
            : item
        )
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: Date.now(),
          category: formData.category,
          categoryslug: formData.categoryslug,
          status: formData.status ? "Active" : "Inactive",
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Category Slug",
      dataIndex: "categoryslug",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (_: any, record: Category) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(record)}
            className="p-2 text-blue-600"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-600"
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
          <div className="page-header flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
              <h4 className="text-lg font-semibold">Category List</h4>
              <h6 className="text-gray-500">Manage your categories</h6>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded"
            >
              <TbCirclePlus size={18} />
              Add Category
            </button>
          </div>

          <div className="card table-list-card mb-4">
            <div className="card-header flex flex-wrap justify-between items-center gap-3">
              <div className="search-set"></div>
              <FilterBar />
            </div>

            <div className="card-body">
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={categories} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded w-full max-w-lg shadow-lg p-5">
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="text-lg font-bold mb-4">
                {isEditMode ? "Edit Category" : "Add Category"}
              </h5>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium pb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium pb-2">
                  Category Slug
                </label>
                <input
                  type="text"
                  placeholder="Category Slug"
                  value={formData.categoryslug}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryslug: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {isEditMode ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded p-6 text-center max-w-sm">
            <TbTrash size={32} className="mx-auto text-red-600 mb-2" />
            <h4 className="font-bold mb-2">Delete Category</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this category?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
