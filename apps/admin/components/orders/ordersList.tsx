// apps/admin/components/orders/ordersList.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/core/common/pagination/datatable";
import { all_routes } from "@/data/all_routes";

import Link from "next/link";
import { Eye } from "react-feather";
import FilterBar from "./FilterBar";
import { useToast } from "@repo/ui";

type Order = {
  order_id: number;
  customer_name: string;
  order_date: string;
  items_count: number;
  total_amount: number;
  status: string;
  payment_reference: string;
};

type Filters = {
  search?: string;
  customer?: string;
  product?: string;
  status?: string;
  sort?: string;
};

export default function OrdersListComponent() {
  const route = all_routes;

  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchOrders = async (appliedFilters = filters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams(
        Object.entries(appliedFilters).filter(([_, v]) => v) as any
      );

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      setOrders(data.items || []);
    } catch (err) {
      showToast("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (id: number) => <strong>#{id}</strong>,
    },
    { title: "Customer", dataIndex: "customer_name" },
    { title: "Date", dataIndex: "order_date" },
    { title: "Items", dataIndex: "items_count" },
    {
      title: "Total",
      dataIndex: "total_amount",
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <span className={`badge badge-${s.toLowerCase()}`}>{s}</span>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: Order) => (
        <Link href={`/admin/orders/${record.order_id}`}>
          <Eye size={16} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <div className="pt-0 page-wrapper">
        <div className="content">
          <div className="page-header flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
              <h4 className="text-lg font-semibold">Orders List</h4>
            </div>
          </div>


          <div className="card table-list-card mb-4">
            <div className="card-header flex flex-wrap justify-between items-center gap-3">
            <FilterBar
              onApply={(newFilters) => {
                setFilters(newFilters);
                fetchOrders(newFilters);
              }}
            />
          </div>
            {/* <div className="card-header flex flex-wrap justify-between items-center gap-3">
              <div className="search-set"></div>
              <FilterBar />
            </div> */}

            <div className="card-body">
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="text-center py-6">Loading...</p>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="order_id"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* 


  const [selectedId, setSelectedId] = useState<number | null>(null);
import { TbCirclePlus, TbTrash } from "react-icons/tb";
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

// ------------------------------------
    //  Delete
//   ------------------------------------
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await fetch(`/api/orders?id=${selectedId}`, {
        method: "DELETE",
      });

      setShowDeleteModal(false);
      setSelectedId(null);
      fetchOrders();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  
          <Link href={`Orders/${record.Order_id}/edit`} className="p-2">
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

// ------------------------- DELETE MODAL -------------------------
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-3">
              <TbTrash size={28} className="text-red-600" />
            </span>
            <h4 className="text-lg font-bold mb-2">Delete Order</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this Order?
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
 */
