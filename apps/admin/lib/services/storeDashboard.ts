// apps/admin/lib/services/storeDashboard.ts

import { pool } from "@acme/db";
import { cache } from "react";

export const getStoreDashboardData = cache(async (storeId: string) => {
  const [
    productsRes,
    ordersRes,
    customersRes,
    usersRes,
    revenueRes,
    monthRevenueRes,
    todayOrdersRes,
    pendingOrdersRes,
    recentOrdersRes,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*) FROM products WHERE store_id = $1`, [storeId]),

    pool.query(`SELECT COUNT(*) FROM orders WHERE store_id = $1`, [storeId]),

    pool.query(`SELECT COUNT(*) FROM customers WHERE store_id = $1`, [storeId]),

    pool.query(`SELECT COUNT(*) FROM store_users WHERE store_id = $1`, [
      storeId,
    ]),

    pool.query(
      `SELECT COALESCE(SUM(total_amount),0) AS total
       FROM orders
       WHERE store_id = $1 AND status = 'completed'`,
      [storeId],
    ),

    pool.query(
      `SELECT COALESCE(SUM(total_amount),0) AS total
       FROM orders
       WHERE store_id = $1
         AND status = 'completed'
         AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`,
      [storeId],
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM orders
       WHERE store_id = $1
         AND DATE(created_at) = CURRENT_DATE`,
      [storeId],
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM orders
       WHERE store_id = $1
         AND status = 'pending'`,
      [storeId],
    ),

    pool.query(
      `SELECT order_id, total_amount, status, created_at
       FROM orders
       WHERE store_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [storeId],
    ),
  ]);

  return {
    totalProducts: Number(productsRes.rows[0].count),
    totalOrders: Number(ordersRes.rows[0].count),
    totalCustomers: Number(customersRes.rows[0].count),
    totalUsers: Number(usersRes.rows[0].count),

    totalRevenue: Number(revenueRes.rows[0].total),
    monthRevenue: Number(monthRevenueRes.rows[0].total),
    todayOrders: Number(todayOrdersRes.rows[0].count),
    pendingOrders: Number(pendingOrdersRes.rows[0].count),

    recentOrders: recentOrdersRes.rows,
  };
});
