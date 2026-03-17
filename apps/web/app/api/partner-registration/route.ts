import { NextRequest, NextResponse } from "next/server";
import { pool } from "@acme/db";
// import nodemailer from "nodemailer";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  {
    // adjust fields to match your formData

    try {
      const body = await req.json();
      console.log(body);
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
        chamberFiles,
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
          chamberFiles,
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

      // const transporter = nodemailer.createTransport({
      //   host: process.env.SMTP_HOST,
      //   port: 587,
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: process.env.SMTP_USER,
      //     pass: process.env.SMTP_PASS,
      //   },
      // });

      // await transporter.sendMail({
      //   from: '"Your Company" <no-reply@yourcompany.com>',
      //   to: business_email_address,
      //   subject: "Partner Registration Confirmation",
      //   text: `Dear ${first_name} ${last_name},Thank you for registering your company (${company_name}) with us. We have received your details and will review them shortly.Best regards, Your Company Team`,
      // });

      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
      console.error(err);
    }
  }
}
