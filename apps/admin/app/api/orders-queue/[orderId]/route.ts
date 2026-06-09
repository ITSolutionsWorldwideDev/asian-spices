// /app/api/orders-queue/[orderId]/route.ts (GET)

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const store = await getCurrentStoreAPI(req);
    const storeId = store.id;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not resolved" },
        { status: 400 },
      );
    }

    const { orderId } = await params;

    // console.log('storeId === ',storeId);
    // console.log('orderId === ',orderId);

    // 🔹 Fetch Order
    const orderResult = await pool.query(
      `
      SELECT
        o.id AS order_id,
        o.order_number,
        o.created_at AS order_date,
        o.payment_status AS status,
        o.payment_status,
        o.order_status,
        o.total_amount,
        o.subtotal,
        o.tax_amount,
        o.discount_amount,
        o.shipping_amount,
        o.shipping_city as customer_city,
        o.shipping_state as customer_state,
        o.shipping_country as customer_country,        
        o.shipping_postal_code as customer_postcode,
        o.weight,
        o.length,
        o.width,
        o.height,
        o.boxes,
        o.tracking_number,
        o.shipping_label,
        o.shipping_provider,
        o.shipped_at,
        COALESCE(o.order_type, 'B2C') as order_type,
        o.current_store_id
      FROM store_orders o
      WHERE o.id = $1 AND (o.current_store_id = $2 OR o.store_id = $2)
      `,
      [orderId, storeId],
    );

    //   c.company_name AS customer_name,
    //   c.email AS customer_email,
    // LEFT JOIN store_customers c ON c.id = o.customer_id

    // if (!orderResult.rows.length) {
    //   return NextResponse.json({ error: "Order not found" }, { status: 404 });
    // }

    if (!orderResult.rowCount) {
      return NextResponse.json({ error: "Order context not found or access denied" }, { status: 404 });
    }

    const orderData = orderResult.rows[0];

    // 🔹 Fetch Items
    const itemsResult = await pool.query(
      `
      SELECT
        oi.id AS order_item_id,
        oi.quantity,
        sp.id AS product_id,
        sp.name,
        sp.sku,  
        COALESCE(oi.fulfilled_quantity, 0) as fulfilled_quantity,
        COALESCE(sp.quantity, 0) as available_stock,
        oi.price
      FROM store_order_items oi
      LEFT JOIN store_products sp ON sp.id = oi.product_id
      WHERE oi.order_id = $1
      `,
      [orderId],
    );

    const orderDetails = {
      ...orderData,
      items: itemsResult.rows.map(item => ({
        ...item,
        price: Number(item.price),
        // Instantiate the local state mutable control mapping defaulted to 0 or current allocation
        fulfilled_quantity: item.fulfilled_quantity || 0 
      }))
    };

    return NextResponse.json({ order: orderDetails });

    // return NextResponse.json({
    //   order: {
    //     ...orderResult.rows[0],
    //     items: itemsResult.rows,
    //   },
    // });
  } catch (error) {
    console.error("Order detail fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch order detail" },
      { status: 500 },
    );
  }
}
