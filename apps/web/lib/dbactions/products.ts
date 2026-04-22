import { pool } from "@acme/db";

const getProducts = async (category: string, categoryParam: string[] = []) => {
  try {
    let query = `
     SELECT sp.* 
      FROM store_products sp
      INNER JOIN store_categories c 
      ON sp.category_id = c.id
      WHERE c.slug = $1
    `;
    const values: any[] = [category];

    if (categoryParam.length > 0) {
      query += ` AND sp.subcategory_id = ANY($2)`;
      values.push(categoryParam);
    }

    const result = await pool.query(query, values);

    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export { getProducts };
