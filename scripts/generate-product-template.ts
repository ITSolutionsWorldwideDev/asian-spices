// scripts/generate-product-template.ts

import ExcelJS from "exceljs";
// import fs from "fs";

async function generate() {
  const workbook = new ExcelJS.Workbook();

  /* ==============================
     PRODUCTS SHEET
  ============================== */

  const productSheet = workbook.addWorksheet("Products");

  const headers = [
    "Name",
    "Slug",
    "SKU",
    "Item Code",
    "Category",
    "Subcategory",
    "Brand",
    "Country of Origin",
    "Available Countries",
    "Description",
    "Health Benefits",
    "Price",
    "Quantity",
    "Discount Type",
    "Discount Value",
    "Status",
    "Images",
    "B2B Prices",
    "Catalog Store",
    "Catalog Price",
    "Catalog Quantity",
  ];

  productSheet.addRow(headers);

  // Style header
  productSheet.getRow(1).font = { bold: true };

  /* ==============================
     SAMPLE DATA
  ============================== */

  productSheet.addRow([
    "Lenovo IdeaPad 3",
    "lenovo-ideapad-3",
    "LEN12345",
    "ITM001",
    "Computers",
    "Laptops",
    "Lenovo",
    "China",
    "India,USA",
    "Lightweight 15-inch laptop",
    "Good for productivity",
    599.99,
    50,
    "PERCENT",
    10,
    "Active",
    "https://img1.jpg,https://img2.jpg",
    '[{"min_quantity":10,"price":550}]',
    "Main Store",
    580,
    30,
  ]);

  /* ==============================
     LOOKUP SHEETS (HIDDEN)
  ============================== */

  const categories = ["Computers", "Electronics", "Fashion"];
  const subcategories = ["Laptops", "Headphones", "Shoes", "Mobiles"];
  const brands = ["Lenovo", "Beats", "Apple", "Dell", "Nike"];
  const countries = ["USA", "India", "China", "Canada", "UK", "Vietnam"];
  const statuses = ["Active", "Inactive"];
  const discountTypes = ["PERCENT", "FLAT"];

  function createLookupSheet(name: string, data: string[]) {
    const sheet = workbook.addWorksheet(name);
    data.forEach((val, i) => sheet.getCell(`A${i + 1}`).value = val);
    sheet.state = "hidden";
    return sheet;
  }

  createLookupSheet("Categories", categories);
  createLookupSheet("Subcategories", subcategories);
  createLookupSheet("Brands", brands);
  createLookupSheet("Countries", countries);
  createLookupSheet("Statuses", statuses);
  createLookupSheet("DiscountTypes", discountTypes);

  /* ==============================
     DATA VALIDATIONS
  ============================== */

  function addDropdown(col: string, formula: string) {
    for (let i = 2; i <= 200; i++) {
      productSheet.getCell(`${col}${i}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [formula],
      };
    }
  }

  addDropdown("E", "Categories!$A$1:$A$100"); // Category
  addDropdown("F", "Subcategories!$A$1:$A$100");
  addDropdown("G", "Brands!$A$1:$A$100");
  addDropdown("H", "Countries!$A$1:$A$100");
  addDropdown("N", "DiscountTypes!$A$1:$A$100");
  addDropdown("P", "Statuses!$A$1:$A$100");

  /* ==============================
     INSTRUCTIONS SHEET
  ============================== */

  const instructions = workbook.addWorksheet("Instructions");

  instructions.addRow(["Product Import Instructions"]);
  instructions.getRow(1).font = { bold: true };

  instructions.addRows([
    [],
    ["1. Do not change column names."],
    ["2. Category, Brand, etc. must match dropdown values."],
    ["3. Available Countries → comma separated (India,USA)"],
    ["4. Images → comma separated URLs"],
    ["5. B2B Prices must be valid JSON:"],
    ['   [{"min_quantity":10,"price":500}]'],
    ["6. Status → Active or Inactive"],
    ["7. Discount Type → PERCENT or FLAT"],
    ["8. Do not remove hidden sheets"],
  ]);

  /* ==============================
     SAVE FILE
  ============================== */

  await workbook.xlsx.writeFile("products-sample.xlsx");

  console.log("✅ products-sample.xlsx generated");
}

generate();