// apps/admin/app/api/media/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@acme/auth";

import { NextResponse } from "next/server";
import { pool } from "@acme/db";

// --------------------------
// GET - List or Single Media
// --------------------------

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    `SELECT media_id, file_name, file_url, file_type, created_at
     FROM media
     ORDER BY created_at DESC`
  );

  return NextResponse.json(result.rows);
}

// --------------------------
// DELETE - Delete Media File
// --------------------------

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await pool.query(`DELETE FROM media WHERE media_id = $1`, [id]);

  return NextResponse.json({ success: true });
}
