// apps/admin/components/platform/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ChevronsLeft } from "react-feather";

const PLATFORM_MENU = [
  {
    label: "Dashboard",
    icon: "layout-grid",
    link: "/dashboard"
  },
  {
    label: "Stores",
    icon: "building-store",
    link: "/stores"
  },
  {
    label: "Users & Roles",
    icon: "users",
    link: "/users"
  },
  {
    label: "Billing",
    icon: "credit-card",
    link: "/billing"
  },
  {
    label: "Settings",
    icon: "settings-cog",
    link: "/settings"
  }
];

export default function PlatformSidebar() {
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);
  const [expandMenus, setExpandMenus] = useState(false);

  const handleSidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    setToggle(!toggle);
  };

  const expandMenuOpen = () => {
    setExpandMenus(true);
    document.body.classList.add("expand-menu");
  };

  const expandMenuClose = () => {
    setExpandMenus(false);
    document.body.classList.remove("expand-menu");
  };

  useEffect(() => {
    document.body.classList.toggle("expand-menu", expandMenus);
  }, [expandMenus]);

  return (
    <div
      className={`sidebar ${toggle ? "" : "active"} ${expandMenus ? "expand-menu" : ""}`}
      onMouseOver={expandMenuOpen}
      onMouseLeave={expandMenuClose}
      id="sidebar"
    >
      <div className="sidebar-logo p-3 flex items-center justify-between">
        <Link href="/platform/dashboard" className="logo">
          <img src="/assets/img/logo.svg" alt="Logo" />
        </Link>
        <button onClick={handleSidebar}>
          <ChevronsLeft />
        </button>
      </div>
      <PerfectScrollbar>
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              {PLATFORM_MENU.map((item) => (
                <li key={item.link} className={pathname.startsWith(item.link) ? "active" : ""}>
                  <Link href={item.link}>
                    <i className={`ti ti-${item.icon} me-2`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
}

/* "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PLATFORM_MENU = [
  {
    label: "Dashboard",
    href: "/dashboard"
  },
  {
    label: "Stores",
    href: "/stores"
  },
  {
    label: "Users & Roles",
    href: "/users"
  },
  {
    label: "Billing",
    href: "/billing"
  },
  {
    label: "Settings",
    href: "/settings"
  }
];

export default function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <ul>
        {PLATFORM_MENU.map(item => (
          <li
            key={item.href}
            className={pathname.startsWith(item.href) ? "active" : ""}
          >
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
} */
