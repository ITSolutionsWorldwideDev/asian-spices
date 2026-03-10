// scripts/seed-countries.ts

import { pool } from "@acme/db";
import fetch from "node-fetch";
// import { pool } from "../lib/db"; // adjust path

async function seedCountries() {
  try {
    console.log("Fetching countries...");

    const res = await fetch("https://restcountries.com/v3.1/all");
    const countries = await res.json();

    for (const country of countries) {
      const currencyKey = country.currencies
        ? Object.keys(country.currencies)[0]
        : null;

      const currency = currencyKey
        ? country.currencies[currencyKey]
        : null;

      await pool.query(
        `
        INSERT INTO countries (
          name,
          iso2,
          iso3,
          phone_code,
          currency_code,
          currency_name,
          currency_symbol,
          region,
          subregion,
          flag_url
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (iso2) DO NOTHING
        `,
        [
          country.name.common,
          country.cca2,
          country.cca3,
          country.idd?.root
            ? country.idd.root +
              (country.idd.suffixes?.[0] || "")
            : null,
          currencyKey,
          currency?.name || null,
          currency?.symbol || null,
          country.region,
          country.subregion,
          country.flags?.png || null,
        ]
      );
    }

    console.log("Countries seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedCountries();