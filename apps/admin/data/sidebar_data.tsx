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
      // {
      //   label: "Pages",
      //   icon: "page-break",
      //   showSubRoute: false,
      //   submenu: true,
      //   submenuItems: [{ label: "Pages", link: "/pages" }],
      // },
      {
        label: "Blog",
        link: "/blogs",
        icon: "wallpaper",
        showSubRoute: false,
        submenu: false,
      },
      // {
      //   label: "Blog",
      //   icon: "wallpaper",
      //   showSubRoute: false,
      //   submenu: true,
      //   submenuItems: [
      //     { label: "All Blog", link: '/blogs' },
      //     { label: "Blog Tags", link: all_routes.blogTag },
      //     { label: "Categories", link: all_routes.blogCategories },
      //     { label: "Blog Comments", link: all_routes.blogComments },
      //   ],
      // },
      // {
      //   label: "FAQ",
      //   icon: "help-circle",
      //   link: all_routes.faq,
      //   showSubRoute: false,
      //   submenu: false,
      // },
    ],
  },
      // {
      //   tittle: 'Content',
      //   hasSubRoute: true,
      //   showSubRoute: false,
      //   subRoutes: [
      //     {
      //       tittle: 'Blog',
      //       hasSubRoute: true,
      //       showSubRoute: true,
      //       subRoutes: [
      //         {
      //           tittle: 'All Blog',
      //           hasSubRoute: true,
      //           showSubRoute: true,
      //           route: "/blogs",
      //           subRoutes: [],
      //         },
      //       ],
      //     },

      //   ],
      // },

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
      // {
      //   label: "Roles & Permissions",
      //   link: "/roles-permissions",
      //   icon: "jump-rope",
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
