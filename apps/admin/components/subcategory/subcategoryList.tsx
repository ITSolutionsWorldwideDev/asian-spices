// apps/admin/components/subcategory/subcategoryList.tsx
"use client";

import React, { useEffect, useState } from "react";
import Table from "@/core/common/pagination/datatable";
import { Edit, Trash2 } from "react-feather";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import { Button, useToast } from "@repo/ui";

type Subcategory = {
  subcategory_id: number;
  category_id: string;
  category_code: string;
  title: string;
  description: string;
  status: number;
};

type Category = {
  category_id: number;
  category: string;
};

const initialForm = {
  subcategory_id: null as number | null,
  category_id: "",
  title: "",
  description: "",
  status: true,
};

export default function SubcategoryListComponent() {
  const [data, setData] = useState<Subcategory[]>([]);
  const [categories, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState(initialForm);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { showToast } = useToast();

  /* ------------------------------------
     Load Data
  ------------------------------------ */

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subcategory");
      const json = await res.json();
      setData(json.items || []);
    } catch {
      showToast("error", "Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const json = await res.json();
      setCategory(json.items || []);
    } catch {
      showToast("error", "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  /* ------------------------------------
     Modals
  ------------------------------------ */
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (row: Subcategory) => {
    setIsEditMode(true);
    setFormData({
      subcategory_id: row.subcategory_id,
      category_id: String(row.category_id),
      title: row.title,
      description: row.description,
      status: row.status === 1,
    });
    setIsModalOpen(true);
  };

  /* ------------------------------------
     Submit
  ------------------------------------ */
  const handleSubmit = async () => {
    if (!formData.title || !formData.category_id) {
      showToast("error", "Title and Category are required");
      return;
    }

    setSaving(true);

    const payload = {
      category_id: Number(formData.category_id),
      title: formData.title,
      description: formData.description,
      status: formData.status ? 1 : 0,
    };

    try {
      const res = await fetch("/api/subcategory", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditMode
            ? { subcategory_id: formData.subcategory_id, ...payload }
            : payload
        ),
      });

      if (!res.ok) throw new Error();

      showToast(
        "success",
        isEditMode ? "Subcategory updated" : "Subcategory created"
      );

      setIsModalOpen(false);
      fetchData();
    } catch {
      showToast("error", "Failed to save subcategory");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------
     Delete
  ------------------------------------ */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/subcategory?id=${deleteId}`, { method: "DELETE" });
      showToast("success", "Subcategory deleted");
      fetchData();
    } catch {
      showToast("error", "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  /* ------------------------------------
     Table Columns
  ------------------------------------ */
  const columns = [
    { title: "Code", dataIndex: "category_code" },
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Status",
      render: (_: any, r: Subcategory) =>
        r.status === 1 ? "Active" : "Inactive",
    },
    {
      title: "Action",
      render: (_: any, r: Subcategory) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(r)}>
            <Edit size={16} />
          </button>
          <button onClick={() => setDeleteId(r.subcategory_id)}>
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
          <div className="page-header flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-semibold">Subcategory List</h4>
              <h6 className="text-gray-500">Manage your subcategory</h6>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded"
            >
              <TbCirclePlus size={18} />
              Add Subcategory
            </button>
          </div>

          <div className="card table-list-card">
            {/* <div className="card-header flex justify-between items-center">
              <FilterBar />
            </div> */}

            <div className="card-body">
              {loading ? (
                <p className="text-center py-6">Loading...</p>
              ) : (
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey="subcategory_id"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 modal fade">
          <div className="modal-content modal-content-demo bg-white rounded w-full max-w-lg">
            <div className="modal-header flex">
              <h4 className="modal-title">
                {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
              </h4>
              <Button
                className="btn-close float-right"
                onClick={() => setIsModalOpen(false)}
              >X</Button>
            </div>

            <div className="modal-body">
              {/* CATEGORY */}

              <div className="mb-3">
                <label className="col-form-label">Category:</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  // disabled="{isEditMode}"
                  disabled={isEditMode}
                  className={`w-full border rounded px-3 py-2 mb-3 ${isEditMode ? "bg-soft-dark" : ""}`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="col-form-label">Subcategory:</label>

                <input
                  type="text"
                  placeholder="Subcategory name"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 mb-4"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mb-3">
                <label className="col-form-label">Description:</label>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 mb-3"
                />
              </div>

              <label className="flex items-center gap-2 mb-4">
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

            <div className="modal-footer flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save"}
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
            <h4 className="font-bold mb-2">Delete Subcategory</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this title?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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