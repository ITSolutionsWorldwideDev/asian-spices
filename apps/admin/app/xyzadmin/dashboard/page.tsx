// apps/admin/app/admin/dashboard/page.tsx
"use client";

import { all_routes } from "@/data/all_routes";

import SalesWidgets from "@/components/dashboard/SalesWidgets";
import RevenueWidgets from "@/components/dashboard/RevenueWidgets";
import SalesPurchaseOverview from "@/components/dashboard/SalesPurchaseOverview";
import ProductsSection from "@/components/dashboard/ProductsSection";
import SalesAndTransactions from "@/components/dashboard/SalesAndTransactions";
import DashboardSideWidgets from "@/components/dashboard/DashboardSideWidgets";

export default function Dashboard() {

  const route = all_routes;

  return (
    <div className="page-wrapper">
      <div className="content">

        {/* ---------------- HEADER SECTION ---------------- */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
          <div className="mb-3">
            <h1 className="mb-1 custome-heading">Welcome, Admin</h1>
            <p className="fw-medium">
              You have{" "}
              <span className="text-primary fw-bold">200+</span> Orders, Today
            </p>
          </div>
        </div>

        {/* ---------------- DASHBOARD SECTIONS ---------------- */}
        <SalesWidgets />
        <RevenueWidgets />
        <SalesPurchaseOverview />

        <ProductsSection
          route={{
            lowstock: route.lowstock,
          }}
        />

        <SalesAndTransactions />

        <DashboardSideWidgets route={route} />
      </div>
    </div>
  );
}