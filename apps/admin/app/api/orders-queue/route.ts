// apps/admin/app/api/orders-queue/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";


export async function GET(req: NextRequest) {
  try {

    
    const { searchParams } = req.nextUrl;

    const store = await getCurrentStoreAPI(req);
    const storeId = store.id;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not resolved" },
        { status: 400 },
      );
    }


    const search = searchParams.get("search") || "";
    const product = searchParams.get("product") || "";
    const sort = searchParams.get("sort") || "";

    const values: any[] = [storeId];
    // 💡 Strict Queue Rule: Must match current store, status must be 'processing' (pending store choice)
    let whereConditions = ["(o.store_id = $1 OR o.current_store_id = $1)", " o.payment_status = 'paid' ", "o.order_status = 'pending'"];

  
    // 🔍 Reference ID Filter
    if (search.trim()) {
      values.push(`%${search.trim()}%`);
      whereConditions.push(`o.order_number ILIKE $${values.length}`);
    }

    // 📦 Product Filtering
    if (product.trim()) {
      values.push(`%${product.trim()}%`);
      whereConditions.push(`
        EXISTS (
          SELECT 1 FROM store_order_items oi
          JOIN store_products p ON p.id = oi.product_id
          WHERE oi.order_id = o.id AND p.name ILIKE $${values.length}
        )
      `);
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Sort Queue Order: Prioritize by oldest first so stores hit their fulfillment SLAs
    let orderBy = `ORDER BY o.created_at ASC`; 
    if (sort === "date_desc") orderBy = `ORDER BY o.created_at DESC`;
    if (sort === "total_desc") orderBy = `ORDER BY o.total_amount DESC`;
    if (sort === "total_asc") orderBy = `ORDER BY o.total_amount ASC`;

    const dataQuery = `
      SELECT 
        o.id as order_id,
        o.order_number,
        o.created_at as order_date,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.shipping_city as city,
        (SELECT COALESCE(SUM(quantity), 0) FROM store_order_items WHERE order_id = o.id) as items_count
      FROM store_orders o
      ${whereClause}
      ${orderBy}
    `;

    // console.log('dataQuery === ',dataQuery);
    // console.log('values === ',values);

    const { rows } = await pool.query(dataQuery, values);

    return NextResponse.json({ items: rows });
  } catch (error: any) {
    console.error("STORE PARTNER QUEUE AGGREGATION ERROR:", error);
    return NextResponse.json({ error: "Failed to gather partner store pending allocation feeds" }, { status: 500 });
  }
}
