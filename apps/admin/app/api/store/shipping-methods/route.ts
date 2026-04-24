// apps/admin/app/api/store/shipping-methods/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getCurrentStoreAPI } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
    
  const store = await getCurrentStoreAPI(req);
  const storeId = store.id;

  const { rows } = await pool.query(
    `
    SELECT sm.*, sp.slug
    FROM shipping_methods sm
    LEFT JOIN shipping_providers sp
      ON sm.provider_id = sp.id
    WHERE sm.store_id = $1
      AND sm.is_active = true
    `,
    [storeId],
  );

  return NextResponse.json({ methods: rows });
}
