import { all_routes } from "@/data/all_routes";

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
        // submenu: true,
        // showSubRoute: false,

        // submenuItems: [
        //   { label: "Admin Dashboard", link: "/dashboard" },
        //   // { label: "Admin Dashboard 2", link: "/admin-dashboard" },
        //   // { label: "Sales Dashboard", link: "/sales-dashboard" },
        // ],
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
        label: "Products",
        link: "/products",
        icon: "box",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Create Product",
        link: "/add-product",
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
      // {
      //   label: "Sales",
      //   icon: "layout-grid",
      //   showSubRoute: false,
      //   submenu: true,
      //   submenuItems: [
      //     {
      //       label: "Online Orders",
      //       link: route.onlineorder,
      //       showSubRoute: false,
      //     },
      //     { label: "POS Orders", link: route.posorder, showSubRoute: false },
      //   ],
      // },
      {
        label: "Invoices",
        link: route.invoice,
        icon: "file-invoice",
        showSubRoute: false,
        submenu: false,
      },
      // {
      //   label: "Sales Return",
      //   link: "/sales-returns",
      //   icon: "receipt-refund",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Quotation",
      //   link: "/quotation-list",
      //   icon: "files",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "POS",
      //   icon: "device-laptop",
      //   showSubRoute: false,
      //   submenu: true,
      //   submenuItems: [
      //     { label: "POS 1", link: "/pos", showSubRoute: false },
      //     { label: "POS 2", link: "/pos-2", showSubRoute: false },
      //     { label: "POS 3", link: "/pos-3", showSubRoute: false },
      //     { label: "POS 4", link: "/pos-4", showSubRoute: false },
      //     { label: "POS 5", link: "/pos-5", showSubRoute: false },
      //   ],
      // },
    ],
  },

  {
    label: "People",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "People",

    submenuItems: [
      {
        label: "Customers",
        link: route.customers,
        icon: "users-group",
        showSubRoute: false,
        submenu: false,
      },
      // {
      //   label: "Billers",
      //   link: "/billers",
      //   icon: "user-up",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Suppliers",
      //   link: "/suppliers",
      //   icon: "user-dollar",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Stores",
      //   link: "/store-list",
      //   icon: "home-bolt",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Warehouses",
      //   link: "/warehouse",
      //   icon: "archive",
      //   showSubRoute: false,
      //   submenu: false,
      // },
    ],
  },

  {
    label: "User Management",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "User Management",
    submenuItems: [
      {
        label: "Users",
        link: "/users",
        icon: "shield-up",
        showSubRoute: false,
      },
      {
        label: "Roles & Permissions",
        link: "/roles-permissions",
        icon: "jump-rope",
        showSubRoute: false,
      },
      // {
      //   label: "Delete Account Request",
      //   link: "/delete-account",
      //   icon: "trash-x",
      //   showSubRoute: false,
      // },
    ],
  },
  {
    label: "Settings",
    submenu: true,
    showSubRoute: false,
    submenuHdr: "Settings",
    submenuItems: [
      // {
      //   label: "General Settings",
      //   submenu: true,
      //   showSubRoute: false,
      //   icon: "settings",
      //   submenuItems: [
      //     { label: "Profile", link: "/general-settings" },
      //     { label: "Security", link: "/security-settings" },
      //     { label: "Notifications", link: "/notification" },
      //     { label: "Connected Apps", link: "/connected-apps" },
      //   ],
      // },

      {
        label: "Logout",
        link: "/signin",
        icon: "logout",
        showSubRoute: false,
      },
    ],
  },
];
