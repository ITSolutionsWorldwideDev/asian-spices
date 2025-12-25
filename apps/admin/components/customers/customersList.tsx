// apps/admin/components/customers/CustomersList.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/core/common/pagination/datatable";
import Link from "next/link";
import { Eye } from "react-feather";
import CustomerFilterBar from "./CustomerFilterBar";
import { useToast } from "@repo/ui";

type Customer = {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  total_orders: number;
  total_spent: number;
};

type Filters = {
  search?: string;
  status?: string;
  sort?: string;
};

export default function CustomersListComponent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchCustomers = async (filters: Filters = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v) as any
      );

      const res = await fetch(`/api/customers?${params.toString()}`);
      const data = await res.json();

      setCustomers(data.items || []);
    } catch {
      showToast("error", "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    {
      title: "Customer",
      render: (_: any, r: Customer) =>
        `${r.first_name} ${r.last_name ?? ""}`,
    },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Orders", dataIndex: "total_orders" },
    {
      title: "Spent",
      dataIndex: "total_spent",
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <span className={`badge badge-${s.toLowerCase()}`}>
          {s}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_: any, r: Customer) => (
        <Link href={`/admin/customers/${r.customer_id}`}>
          <Eye size={16} />
        </Link>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header mb-4">
          <h4 className="text-lg font-semibold">Store Customers</h4>
          <p className="text-gray-500">
            Customers registered on your store
          </p>
        </div>

        <div className="card table-list-card">
          <div className="card-header flex flex-wrap justify-between items-center gap-3">
            <CustomerFilterBar onApply={fetchCustomers} />
          </div>

          <div className="card-body">
            {loading ? (
              <p className="text-center py-6">Loading...</p>
            ) : (
              <Table
                columns={columns}
                dataSource={customers}
                rowKey="customer_id"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
