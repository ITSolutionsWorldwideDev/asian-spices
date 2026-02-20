// apps/admin/lib/auth/permissions.ts
export const PERMISSIONS = {
  MANAGE_STORES: "manage_stores",
  MANAGE_PRODUCTS: "manage_products",
  VIEW_ORDERS: "view_orders"
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];
