// apps/admin/data/sidebar_data.tsx
// import { all_routes as route } from "./all_routes";

export interface SidebarSubItem {
  label: string;
  link: string;
  icon?: string;
  submenu?: boolean;
  submenuItems?: SidebarSubItem[];
}

export interface SidebarItem {
  label: string;
  icon?: string;
  link?: string;
  submenu?: boolean;
  submenuHdr?: string;
  submenuItems?: SidebarSubItem[];
}

export const SidebarData: SidebarItem[] = [
  {
    label: "Main",
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: "layout-grid",
        link: "/dashboard",
        submenu: false,
      },
    ],
  },
  {
    label: "Inventory",
    submenu: true,
    submenuHdr: "Inventory",
    submenuItems: [
      { label: "Products Catalog", link: "/products-catalog", icon: "box", submenu: false },
    ],
  },
  {
    label: "Sales",
    submenuHdr: "Sales",
    submenu: true,
    submenuItems: [
      { label: "Orders", link: "/orders", icon: "file-invoice", submenu: false },
      // { label: "Invoices", link: "/invoice", icon: "file-invoice", submenu: false },
    ],
  },
  {
    label: "Content (CMS)",
    submenuHdr: "Content (CMS)",
    submenuItems: [
      { label: "Blog", link: "/blogs", icon: "wallpaper", submenu: false },
    ],
  },
  {
    label: "User Management",
    submenuHdr: "User Management",
    submenuItems: [
      { label: "Customers", link: "/customers", icon: "users-group", submenu: false },
      { label: "Users", link: "/users", icon: "shield-up", submenu: false },
      { label: "Roles & Permissions", link: "/settings/roles", icon: "shield-up", submenu: false },
      
          // {
          //   tittle: 'Roles & Permissions',
          //   hasSubRoute: false,
          //   showSubRoute: false,
          //   route: "/roles-permissions",
          //   subRoutes: [],
          // },
          // {
          //   tittle: 'Delete Account Request',
          //   hasSubRoute: false,
          //   showSubRoute: false,
          //   route: "/delete-account",
          //   subRoutes: [],
          // },
    ],
  },
  {
    label: "Settings",
    submenuHdr: "Settings",
    submenuItems: [
      { label: "Store Settings", link: "/settings", icon: "settings", submenu: false },
      // { label: "Logout", link: "/signin", icon: "logout", submenu: false },
    ],
  },
];

/* export const SidebarData = [
  {
    label: "Main",
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: "layout-grid",
        link: route.dashboard,
        submenu: false,
      },
    ],
  },
  {
    label: "Inventory",
    submenuHdr: "Inventory",
    submenuItems: [
      { label: "Category", link: route.category, icon: "list-details", submenu: false },
      { label: "Sub Category", link: route.subcategories, icon: "carousel-vertical", submenu: false },
      { label: "Brands", link: route.brand, icon: "triangles", submenu: false },
      { label: "Products", link: route.products, icon: "box", submenu: false },
      { label: "Create Product", link: route.new_product, icon: "table-plus", submenu: false },
      { label: "Media", link: route.media, icon: "table-plus", submenu: false },
    ],
  },
  {
    label: "Sales",
    submenuHdr: "Sales",
    submenuItems: [
      { label: "Orders", link: route.orders, icon: "file-invoice", submenu: false },
      { label: "Invoices", link: route.invoice, icon: "file-invoice", submenu: false },
    ],
  },
  {
    label: "Content (CMS)",
    submenuHdr: "Content (CMS)",
    submenuItems: [
      { label: "Blog", link: route.blogs, icon: "wallpaper", submenu: false },
    ],
  },
  {
    label: "User Management",
    submenuHdr: "User Management",
    submenuItems: [
      { label: "Customers", link: route.customers, icon: "users-group", submenu: false },
      { label: "Users", link: route.users, icon: "shield-up", submenu: false },
    ],
  },
  {
    label: "Settings",
    submenuHdr: "Settings",
    submenuItems: [
      { label: "Logout", link: route.signin, icon: "logout", submenu: false },
    ],
  },
]; */

/* import { all_routes } from "@/data/all_routes";
const route = all_routes;

export const SidebarData = [
  {
    label: "Main",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        icon: "layout-grid",
        link: "/dashboard",
      },
    ],
  },
  {
    label: "Inventory",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Category",
        link: "/category",
        icon: "list-details",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Sub Category",
        link: "/sub-categories",
        icon: "carousel-vertical",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Brands",
        link: "/brand",
        icon: "triangles",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Products",
        link: "/products",
        icon: "box",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Create Product",
        link: "/products/new",
        icon: "table-plus",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Media",
        link: "/media",
        icon: "table-plus",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "Sales",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Orders",
        link: "/orders",
        icon: "file-invoice",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Invoices",
        link: route.invoice,
        icon: "file-invoice",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },

  {
    label: "Content (CMS)",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Content (CMS)",
    submenuItems: [
      {
        label: "Blog",
        link: "/blogs",
        icon: "wallpaper",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "User Management",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "User Management",
    submenuItems: [
      {
        label: "Customers",
        link: route.customers,
        icon: "users-group",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Users",
        link: "/users",
        icon: "shield-up",
        showSubRoute: false,
      },
    ],
  },
  {
    label: "Settings",
    submenu: true,
    showSubRoute: false,
    submenuHdr: "Settings",
    submenuItems: [

      {
        label: "Logout",
        link: "/signin",
        icon: "logout",
        showSubRoute: false,
      },
    ],
  },
]; */
