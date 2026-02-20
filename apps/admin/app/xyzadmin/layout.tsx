// apps/admin/app/admin/layout.tsx
import { ToastProvider } from "@repo/ui";
import Header from "@/components/header";
// import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="main-wrapper">
        <Header />
        {/* <Sidebar /> */}
        <main>{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
