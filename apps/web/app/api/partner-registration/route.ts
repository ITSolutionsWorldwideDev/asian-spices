import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";

export  async function POST(req: NextRequest) {
  {
    // adjust fields to match your formData

    try {
      const body = await req.json();
      const {
        kvk_number,
        company_name,
        chamber_of_commerce_number,
        country,
        street,
        house_number,
        additional_address,
        postal_code,
        city,
        chamber_of_commerce_extract_document,
        power_of_attorney_document,
        first_name,
        middle_name,
        last_name,
        business_phone_number,
        business_email_address,
        vat_number,
        idin,
      } = body;

      //   if (
      //     !kvk_number ||
      //     !company_name ||
      //     !chamber_of_commerce_number ||
      //     !country ||
      //     !street ||
      //     !house_number ||
      //     !postal_code ||
      //     !city ||
      //     !chamber_of_commerce_extract_document ||
      //     !power_of_attorney_document ||
      //     !first_name ||
      //     !last_name ||
      //     !business_phone_number ||
      //     !business_email_address ||
      //     !vat_number ||
      //     !idin
      //   ) {
      //     return NextResponse.json(
      //       { error: "All fields are required" },
      //       { status: 400 },
      //     );
      //   }

      const result = await pool.query(
        "INSERT INTO partner_registration (kvk_number, company_name, chamber_of_commerce_number,country,street,house_number,additional_address,postal_code,city,chamber_of_commerce_extract_document,power_of_attorney_document,first_name,middle_name,last_name,business_phone_number,business_email_address,vat_number,idin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *",
        [
          kvk_number,
          company_name,
          chamber_of_commerce_number,
          country,
          street,
          house_number,
          additional_address,
          postal_code,
          city,
          chamber_of_commerce_extract_document,
          power_of_attorney_document,
          first_name,
          middle_name,
          last_name,
          business_phone_number,
          business_email_address,
          vat_number,
          idin,
        ],
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
      console.error(err);
      //   res.status(500).json({ error: "Database error" });
      //   console.log(err);
    }
  }
  // res.setHeader("Allow", ["POST"]);
  // res.status(405).end(`Method ${req.method} Not Allowed`);
}
