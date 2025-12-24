// apps/admin/app/api/products/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { mediaIds, primaryMediaId } = await req.json();

    await pool.query(`DELETE FROM product_images WHERE product_id=$1`, [
      params.id,
    ]);

    for (const mediaId of mediaIds) {
      await pool.query(
        `INSERT INTO product_images(product_id, media_id, is_primary)
         VALUES ($1, $2, $3)`,
        [params.id, mediaId, mediaId === primaryMediaId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to attach images", detail: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { mediaIds, primaryMediaId } = await req.json();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Remove old relations
    await client.query(
      "DELETE FROM product_images WHERE product_id = $1",
      [id]
    );

    // Insert new ones
    for (const mediaId of mediaIds) {
      await client.query(
        `INSERT INTO product_images (product_id, media_id, is_primary)
         VALUES ($1, $2, $3)`,
        [id, mediaId, mediaId === primaryMediaId]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

