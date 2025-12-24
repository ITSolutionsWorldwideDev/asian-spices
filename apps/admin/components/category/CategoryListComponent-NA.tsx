"use client";

import { useState } from "react";
import Link from "next/link";
import Table from "@/core/common/pagination/datatable";
import { categorylist } from "@/core/json/categorylistdata";
// import AddCategoryModal from "./AddCategoryModal";
// import EditCategoryModal from "./EditCategoryModal";
// import AddCategoryModal from "./AddCategoryModal";

export default function CategoryListComponent() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
      title: "Created On",
      dataIndex: "createdon",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
          {text}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      render: () => (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            ✏️
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-bold">Category</h4>
          <p className="text-sm text-gray-500">Manage your categories</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <Table columns={columns} dataSource={categorylist} />
      </div>

      {/* Modals */}
      {/* <AddCategoryModal open={isAddOpen} onClose={() => setIsAddOpen(false)} /> */}
      {/* <EditCategoryModal open={isEditOpen} onClose={() => setIsEditOpen(false)} /> */}
    </div>
  );
}
