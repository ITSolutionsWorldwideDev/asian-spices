"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import CommonFooter from "@/components/footer";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "../layout.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  // Protect all admin pages
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <main>{children}</main>
      <CommonFooter />
    </div>
  );
}
