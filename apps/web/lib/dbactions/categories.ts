import { pool } from "@acme/db";

export const getCategoryWithSubcategories = async (slug: string) => {
  try {
    // 🔹 Step 1: Get category by slug
    const categoryResult = await pool.query(
      `SELECT id, slug 
       FROM store_categories 
       WHERE LOWER(slug) = LOWER($1)`,
      [slug],
    );
    console.log(slug);

    console.log("Category Result:", categoryResult.rows);
    if (categoryResult.rows.length === 0) {
      return { error: "Category not found" };
    }

    const category = categoryResult.rows[0];

    // 🔹 Step 2: Get subcategories
    const subCategoryResult = await pool.query(
      `SELECT id,name 
       FROM store_subcategories 
       WHERE category_id = $1`,
      [category.id],
    );

    console.log("Subcategory Result:", subCategoryResult.rows);
    return {
      category,
      subcategories: subCategoryResult.rows,
    };
  } catch (error) {
    console.error("DB Action Error:", error);
    return { error: "Database error" };
  }
};
