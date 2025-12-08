// apps\admin\app\layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Asian Spices - Inventory Management & Admin Dashboard Template",
  description:
    "Asian Spices is a powerful Bootstrap-based Inventory Management Admin Template designed for businesses, offering seamless invoicing, project tracking, and estimates.",
  keywords:
    "inventory management, admin dashboard, bootstrap template, invoicing, estimates, business management, responsive admin, POS system",
  author: "IT Solutions Worldwide",
  icons: {
    icon: "favicon.png",
    shortcut: "favicon.png", // Add shortcut icon for better support
    apple: "favicon.png", // Optional: for Apple devices (place in `public/`)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head>
        {/* Load Google Fonts directly here */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>


      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  ); 
}

/* 
// import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@/style/customStyle.scss";
import "@/style/css/feather.css";
import "@/style/css/line-awesome.min.css";
import "@/style/icons/tabler-icons/webfont/tabler-icons.css";
import "@/style/icons/fontawesome/css/fontawesome.min.css";
import "@/style/icons/fontawesome/css/all.min.css";
import "@/style/fonts/feather/css/iconfont.css";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const BootstrapJs = require("@/components/bootstrap-js/bootstrapjs").default;

  return (
    <html lang="en">
      <body>
        <>
          <>{children}</>
          <BootstrapJs />
        </>
      </body>
    </html>
  );
}
*/
