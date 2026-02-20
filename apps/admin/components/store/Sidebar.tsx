// apps/admin/components/store/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useSession } from "next-auth/react";
import { ChevronsLeft } from "react-feather";
import { AUTH_ROLES } from "@acme/auth/constants";

export default function StoreSidebar({ storeId }: { storeId: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
  const [expandMenus, setExpandMenus] = useState(false);

  const roleForStore = session?.user?.storeRoles?.find(
    (r) => r.store_id === storeId
  )?.role;

  const MENU = [
    { label: "Dashboard", link: `/${storeId}/dashboard`, icon: "layout-grid", roles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.EDITOR] },
    { label: "Products", link: `/${storeId}/products`, icon: "box", roles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER] },
    { label: "Orders", link: `/${storeId}/orders`, icon: "file-invoice", roles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.EDITOR] },
    { label: "Customers", link: `/${storeId}/customers`, icon: "users", roles: [AUTH_ROLES.ADMIN] },
    { label: "Settings", link: `/${storeId}/settings`, icon: "settings", roles: [AUTH_ROLES.ADMIN] },
  ];

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
    >
      <div className="sidebar-logo p-3 flex items-center justify-between">
        <Link href={`/${storeId}/dashboard`} className="logo">
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
              {MENU.filter(
                (item) =>
                  session?.user?.isPlatformAdmin ||
                  item.roles.includes(roleForStore as any)
              ).map((item) => (
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
import { useSession } from "next-auth/react";
import { AUTH_ROLES } from "@acme/auth/constants";

export default function StoreSidebar({
  storeId
}: {
  storeId: string;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const roleForStore = session?.user?.storeRoles?.find(
    r => r.store_id === storeId
  )?.role;

  const MENU = [
    {
      label: "Dashboard",
      href: `/${storeId}/dashboard`,
      roles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.EDITOR]
    },
    {
      label: "Products",
      href: `/${storeId}/products`,
      roles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER]
    },
    {
      label: "Orders",
      href: `/${storeId}/orders`,
      roles: [AUTH_ROLES.ADMIN, AUTH_ROLES.MANAGER, AUTH_ROLES.EDITOR]
    },
    {
      label: "Customers",
      href: `/${storeId}/customers`,
      roles: [AUTH_ROLES.ADMIN]
    },
    {
      label: "Settings",
      href: `/${storeId}/settings`,
      roles: [AUTH_ROLES.ADMIN]
    }
  ];

  return (
    <aside className="sidebar">
      <ul>
        {MENU.filter(item =>
          session?.user?.isPlatformAdmin ||
          item.roles.includes(roleForStore as any)
        ).map(item => (
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
