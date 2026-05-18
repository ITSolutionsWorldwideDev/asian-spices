// apps/web/app/api/recipes/route.ts

import { NextRequest, NextResponse } from "next/server";

import { pool } from "@acme/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    /*
     * QUERY PARAMS
     */
    const page = Number(searchParams.get("page") || 1);

    const limit = Number(searchParams.get("limit") || 12);

    const search = searchParams.get("search") || "";

    const category = searchParams.get("category") || "";

    const tag = searchParams.get("tag") || "";

    const featured = searchParams.get("featured") || "";

    const offset = (page - 1) * limit;

    /*
     * WHERE CLAUSES
     */
    const where: string[] = [`r.status = 'published'`];

    const values: any[] = [];

    /*
     * SEARCH
     */
    if (search) {
      values.push(`%${search}%`);

      where.push(`
        (
          r.title ILIKE $${values.length}
          OR r.short_description ILIKE $${values.length}
        )
      `);
    }

    /*
     * CATEGORY FILTER
     */
    if (category) {
      values.push(category);

      where.push(`
        rc.slug = $${values.length}
      `);
    }

    /*
     * TAG FILTER
     */
    if (tag) {
      values.push(tag);

      where.push(`
        EXISTS (
          SELECT 1
          FROM recipe_recipe_tags rrt2
          INNER JOIN recipe_tags rt2
            ON rt2.id = rrt2.tag_id
          WHERE rrt2.recipe_id = r.id
          AND rt2.slug = $${values.length}
        )
      `);
    }

    /*
     * FEATURED FILTER
     */
    if (featured === "true") {
      where.push(`
        r.is_featured = true
      `);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    /*
     * TOTAL COUNT
     */
    const totalQuery = await pool.query(
      `
      SELECT COUNT(DISTINCT r.id)::int AS total
      FROM recipes r
      LEFT JOIN recipe_categories rc
        ON rc.id = r.category_id
      ${whereClause}
      `,
      values,
    );

    const total = totalQuery.rows[0]?.total || 0;

    /*
     * MAIN QUERY
     */
    values.push(limit);

    values.push(offset);

    const { rows } = await pool.query(
      `
      SELECT
        r.id,
        r.title,
        r.slug,
        r.short_description,
        r.thumbnail_url,
        r.youtube_url,
        r.preparation_time,
        r.cooking_time,
        r.servings,
        r.difficulty,
        r.is_featured,
        r.created_at,

        rc.id AS category_id,
        rc.name AS category_name,
        rc.slug AS category_slug,

        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', rt.id,
              'name', rt.name,
              'slug', rt.slug,
              'color', rt.color
            )
          ) FILTER (WHERE rt.id IS NOT NULL),
          '[]'
        ) AS tags

      FROM recipes r

      LEFT JOIN recipe_categories rc
        ON rc.id = r.category_id

      LEFT JOIN recipe_recipe_tags rrt
        ON rrt.recipe_id = r.id

      LEFT JOIN recipe_tags rt
        ON rt.id = rrt.tag_id

      ${whereClause}

      GROUP BY
        r.id,
        rc.id

      ORDER BY
        r.created_at DESC

      LIMIT $${values.length - 1}
      OFFSET $${values.length}
      `,
      values,
    );

    return NextResponse.json({
      success: true,

      items: rows,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET RECIPES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch recipes",
      },
      {
        status: 500,
      },
    );
  }
}
