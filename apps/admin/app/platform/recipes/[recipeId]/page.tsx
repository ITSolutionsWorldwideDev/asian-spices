// app/platform/recipes/[recipeId]/page.tsx

import { pool } from "@acme/db";
import RecipeForm from "./RecipeForm";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;

  const { rows } = await pool.query(
    `
    SELECT *
    FROM recipes
    WHERE id = $1
    `,
    [recipeId],
  );

  const recipe = rows[0];

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <RecipeForm recipe={recipe} />
      </div>
    </div>
  );
}
