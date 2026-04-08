import { pool } from "@acme/db";

const getCategories = async () => {
  try {
    const query = `
      SELECT id, name
      FROM store_categories;
    `;
    const result = await pool.query(query);
    console.log(result);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export { getCategories };
