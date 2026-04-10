// apps/admin/app/platform/orders/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrderFilterBar from "@/components/orders/FilterBar";
import { useToast } from "@repo/ui";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const limit = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...filters,
      });

      const res = await fetch(`/api/platform/orders?${params}`);
      const data = await res.json();

      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      showToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-wrapper">
      <div className="content p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>

        {/* ✅ FILTER BAR */}
        <OrderFilterBar
          onApply={(f) => {
            setPage(1);
            setFilters(f);
          }}
        />

        {/* ✅ TABLE */}

        <div className="card-body">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-6">Loading...</p>
            ) : (
              <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                      <th className="p-3 text-left">Order</th>
                      <th>Status</th>
                      <th>Store</th>
                      <th>Rejections</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{o.order_number}</td>

                        <td>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              o.order_status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : o.order_status === "confirmed"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {o.order_status}
                          </span>
                        </td>

                        <td>{o.store_name || "-"}</td>

                        <td className="text-center">
                          <span className="font-semibold">
                            {o.rejection_count}
                          </span>
                        </td>

                        <td className="text-sm text-gray-500">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>

                        <td>
                          <Link
                            href={`./orders/${o.id}`}
                            className="text-blue-600"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ✅ PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
/* 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FilterBar from "./FilterBar";
import { useToast } from "@repo/ui";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/platform/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders));
  }, []);

  const columns = [
  {
    title: "Product",
    dataIndex: "name",
    render: (text: string, record: Product) => (
      <Link href={`products/${record.id}`} className="text-blue-600 hover:underline">
        {text}
      </Link>
    ),
    sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a: Product, b: Product) => a.category.localeCompare(b.category),
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a: Product, b: Product) => a.brand.localeCompare(b.brand),
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a: Product, b: Product) => a.price - b.price,
    render: (price: number) => `$${price.toLocaleString()}`,
  },
  {
    title: "Qty",
    dataIndex: "quantity",
    sorter: (a: Product, b: Product) => a.quantity - b.quantity,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (s: number) => (
      <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${s ? "bg-green-600" : "bg-red-600"}`}>
        {s ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_: any, record: Product) => (
      <div className="flex gap-2">
        <Link href={`products/${record.id}`} className="p-2 hover:text-blue-600">
          <Eye size={16} />
        </Link>
        <Link href={`products/${record.id}/edit`} className="p-2 hover:text-yellow-600">
          <Edit size={16} />
        </Link>
        <button
          onClick={() => {
            setSelectedId(record.id);
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
    <div className="page-wrapper">
      <div className="content">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Orders</h1>

            <div className="card-body">
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="text-center py-6">Loading...</p>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                  />
                )}
              </div>
            </div>

          <table className="w-full table-auto bg-white rounded shadow">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                <th className="p-4 ">Order</th>
                <th className="p-4 ">Status</th>
                <th className="p-4 ">Store</th>
                <th className="p-4 ">Rejections</th>
                <th className="p-4 "></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-2">{c.order_number}</td>
                  <td className="px-6 py-2">{c.order_status}</td>
                  <td className="px-6 py-2">{c.store_name || "-"}</td>
                  <td className="px-6 py-2">{c.rejection_count}</td>
                  <td className="px-6 py-2">
                    <Link
                      href={`/admin/orders/${c.id}`}
                      className="text-blue-600"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} */
