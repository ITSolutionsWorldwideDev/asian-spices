// apps/admin/app/api/platform/orders/[orderId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;

  const { rows } = await pool.query(
    `
    SELECT 
      o.*,
      o.created_at as assigned_at,
      (o.created_at + interval '1 hour') as deadline,
      s.name as store_name,
      c.first_name || ' ' || c.last_name as customer_name,
      c.email,
      c.phone,
      a.address_line1,
      a.city,
      a.country
    FROM store_orders o
    LEFT JOIN stores s ON s.id = o.current_store_id
    LEFT JOIN store_customers c ON c.id = o.customer_id
    LEFT JOIN store_customer_addresses a 
      ON a.customer_id = c.id
    WHERE o.id = $1
  `,
    [orderId],
  );

  const order = rows[0];

  const { rows: items } = await pool.query(
    `
    SELECT 
        oi.id,
        oi.quantity,
        oi.fulfilled_quantity,
        oi.status,
        p.name as product_name,

        COALESCE(
            json_agg(
                json_build_object(
                'store_id', oia.store_id,
                'store_name', s2.name,
                'allocated_quantity', oia.allocated_quantity,
                'fulfilled_quantity', oia.fulfilled_quantity,
                'status', oia.status
                )
            ) FILTER (WHERE oia.id IS NOT NULL),
            '[]'
        ) as allocations

    FROM store_order_items oi
    JOIN store_products p ON p.id = oi.product_id
    LEFT JOIN order_item_allocations oia 
        ON oia.order_item_id = oi.id
    LEFT JOIN stores s2 ON s2.id = oia.store_id

    WHERE oi.order_id = $1
    GROUP BY oi.id, p.name
    `,
    [orderId],
  );

  //   const { rows: items } = await pool.query(
  //     `
  //     SELECT
  //       oi.*,
  //       p.name as product_name
  //     FROM store_order_items oi
  //     JOIN store_products p ON p.id = oi.product_id
  //     WHERE oi.order_id = $1
  //   `,
  //     [orderId]
  //   );

  //   order.items = items;
  order.items = items.map((item) => ({
    ...item,
    allocations: item.allocations || [],
  }));

  return NextResponse.json({ order });
}
