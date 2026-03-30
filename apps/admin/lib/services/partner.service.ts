// // apps/admin/lib/services/partner.service.ts

import { pool } from "@acme/db";
import { hash } from "bcryptjs";
import slugify from "slugify";
import { randomUUID } from "crypto";

export async function createStoreFromPartner(partner: any) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Generate IDs
    const storeId = randomUUID();
    const userId = randomUUID();

    // 2️⃣ Generate slug
    let slug = slugify(partner.company_name, { lower: true });

    // ensure uniqueness
    const slugCheck = await client.query(
      `SELECT 1 FROM stores WHERE slug = $1`,
      [slug]
    );

    if (slugCheck.rows.length > 0) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // 3️⃣ Create Store
    await client.query(
      `INSERT INTO stores (id, name, slug, owner_email, status)
       VALUES ($1, $2, $3, $4, 'active')`,
      [
        storeId,
        partner.company_name,
        slug,
        partner.business_email_address,
      ]
    );

    // 4️⃣ Create User (store owner)
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hash(tempPassword, 10);

    await client.query(
      `INSERT INTO users (id, email, password_hash, name,store_id)
       VALUES ($1, $2, $3, $4,$5)`,
      [
        userId,
        partner.business_email_address,
        passwordHash,
        `${partner.first_name} ${partner.last_name}`,
        storeId
      ]
    );

    // 5️⃣ Get store_owner role
    const roleRes = await client.query(
      `SELECT id FROM roles WHERE key = 'store_owner'`
    );

    const roleId = roleRes.rows[0].id;

    // 6️⃣ Assign user to store
    await client.query(
      `INSERT INTO store_users (store_id, user_id, role_id)
       VALUES ($1, $2, $3)`,
      [storeId, userId, roleId]
    );

    // 7️⃣ Default settings
    await createDefaultStoreSetup(client, storeId, partner);

    // 8️⃣ Assign plan
    await assignDefaultPlan(client, storeId);

    await client.query("COMMIT");

    return {
      storeId,
      userId,
      tempPassword,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function createDefaultStoreSetup(
  client: any,
  storeId: string,
  partner: any
) {
  await client.query(
    `INSERT INTO store_settings (store_id, store_email, store_phone)
     VALUES ($1, $2, $3)`,
    [
      storeId,
      partner.business_email_address,
      partner.business_phone_number,
    ]
  );

  await client.query(
    `INSERT INTO store_addresses (store_id, address_line1, city, country)
     VALUES ($1, $2, $3, $4)`,
    [storeId, partner.street, partner.city, partner.country]
  );

  await client.query(
    `INSERT INTO store_payment_settings (store_id)
     VALUES ($1)`,
    [storeId]
  );

  await client.query(
    `INSERT INTO store_shipping_settings (store_id)
     VALUES ($1)`,
    [storeId]
  );

  await client.query(
    `INSERT INTO store_tax_settings (store_id)
     VALUES ($1)`,
    [storeId]
  );
}

async function assignDefaultPlan(client: any, storeId: string) {
  const planRes = await client.query(
    `SELECT id FROM plans WHERE is_active = true LIMIT 1`
  );

  if (!planRes.rows.length) return;

  const planId = planRes.rows[0].id;

  await client.query(
    `INSERT INTO subscriptions (id, store_id, plan_id, status)
     VALUES ($1, $2, $3, 'active')`,
    [randomUUID(), storeId, planId]
  );
}