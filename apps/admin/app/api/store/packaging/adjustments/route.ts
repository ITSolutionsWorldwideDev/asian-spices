// apps/admin/app/api/store/packaging/adjustments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { store_id, packaging_type_id, type, quantity, reason } = body;

    if (!store_id || !packaging_type_id || !type || !quantity) {
      return NextResponse.json(
        { success: false, error: "Required fields missing." },
        { status: 400 },
      );
    }

    const changeAmount = parseInt(quantity, 10);
    if (isNaN(changeAmount) || changeAmount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity delta parameter must be a non-zero integer",
        },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    // Apply conditional changes depending on adjustment target field criteria
    if (type === "damaged") {
      // Moves inventory from clean available pile to damaged bucket field tracking
      await client.query(
        `
        UPDATE store_packaging_inventory
        SET 
          quantity_available = quantity_available - $3,
          damaged_quantity = damaged_quantity + $3,
          updated_at = NOW()
        WHERE store_id = $1 AND packaging_type_id = $2
        `,
        [store_id, packaging_type_id, changeAmount],
      );
    } else {
      // Direct adjustment balancing of absolute stock assets
      await client.query(
        `
        UPDATE store_packaging_inventory
        SET 
          quantity_available = quantity_available + $3,
          updated_at = NOW()
        WHERE store_id = $1 AND packaging_type_id = $2
        `,
        [store_id, packaging_type_id, changeAmount],
      );
    }

    // Write persistent immutable audit history record entry tracking line
    await client.query(
      `
      INSERT INTO packaging_inventory_logs (store_id, packaging_type_id, type, quantity_changed, reason)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        store_id,
        packaging_type_id,
        type,
        changeAmount,
        reason || "Manual operational balancing adjust log entries",
      ],
    );

    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
