import "dotenv/config";
import { runQuery } from "@acme/db";
import * as bcrypt from "bcryptjs";

async function createSuperAdmin() {
  const email = "admin@asian-spices.com";
  const password = "asi@n-sp!ces@123";

  const hash = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, role
  `;

  const result = await runQuery(query, [email, hash, "super_admin"]);

  if (result.rowCount === 0) {
    console.log("Super admin already exists");
  } else {
    console.log("Super admin created:", result.rows[0]);
  }

  process.exit(0);
}

createSuperAdmin();
