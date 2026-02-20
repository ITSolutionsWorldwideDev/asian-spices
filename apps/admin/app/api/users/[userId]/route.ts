// apps/admin/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool, buildUpdateQuery } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await requirePlatformAdmin();
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [params.userId]);
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  await requirePlatformAdmin();
  const body = await req.json();

  const { text, values } = buildUpdateQuery("users", body, {
    column: "id",
    value: params.userId,
  });

  const { rows } = await pool.query(text, values);

  // audit log
  await pool.query(
    `INSERT INTO user_audit_logs (user_id, action, actor_id, changes)
     VALUES ($1, 'updated', $2, $3)`,
    [params.userId, body.actorId, JSON.stringify(body)]
  );

  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  await requirePlatformAdmin();
  await pool.query(`DELETE FROM users WHERE id = $1`, [params.userId]);

  // audit log
  const body = await req.json();
  await pool.query(
    `INSERT INTO user_audit_logs (user_id, action, actor_id)
     VALUES ($1, 'deleted', $2)`,
    [params.userId, body.actorId]
  );

  return NextResponse.json({ message: "User deleted" });
}

/* import { NextRequest, NextResponse } from "next/server";
import { buildUpdateQuery, pool } from "@acme/db";
import { requirePlatformAdmin } from "@/lib/auth/guards";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  await requirePlatformAdmin();

  const { userId } = await context.params;

  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return NextResponse.json(result.rows[0]);
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  await requirePlatformAdmin();

  const { userId } = await context.params;
  const body = await req.json();

  const { text, values } = buildUpdateQuery(
    "users",
    body,
    { column: "id", value: userId }
  );

  const result = await pool.query(text, values);

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  await requirePlatformAdmin();

  const { userId } = await context.params;

  await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [userId]
  );

  return NextResponse.json({ message: "User deleted" });
} */

