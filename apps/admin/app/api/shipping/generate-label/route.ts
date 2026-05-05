// apps/admin/app/api/shipping/generate-label/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
import { getShippingProvider } from "@/lib/shipping/providerFactory";

export async function POST(req: NextRequest) {
  const { shipmentId } = await req.json();

  const shipmentRes = await pool.query(
    `SELECT * FROM shipments WHERE id = $1`,
    [shipmentId],
  );

  const shipment = shipmentRes.rows[0];

  if (!shipment) throw new Error("Shipment not found");

  //   const provider = await getShippingProvider(
  //     shipment.provider_slug,
  //     shipment.store_id
  //   );

  const provider = await getShippingProvider(shipment.provider_slug);

  const label = await provider.generateLabel(shipment.external_shipment_id);

  await pool.query(
    `
        UPDATE store_orders
        SET 
            tracking_number = $1,
            shipping_label = $2,
            fulfillment_status = 'shipped',
            updated_at = NOW()
        WHERE id = $3
  `,
    [shipment.tracking_number || null, label.url, shipment.order_id],
  );

  if (!label?.url) {
    throw new Error("Label not ready yet");
  }

  await pool.query(`UPDATE shipments SET label_url = $1 WHERE id = $2`, [
    label.url,
    shipmentId,
  ]);

  return NextResponse.json({ success: true, label });
}
