import { pool } from "@acme/db";

const getProducts = async (category: string) => {
  try {
    const query = `
     SELECT sp.* 
      FROM store_products sp
      INNER JOIN store_categories c 
      ON sp.category_id = c.id
      WHERE c.slug = $1
    `;
    const result = await pool.query(query, [category]);
    // console.log("product results", result);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export { getProducts };
