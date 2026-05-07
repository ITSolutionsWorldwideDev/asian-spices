// apps/web/app/account/layout.tsx

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { requireAuth, webAuthOptions } from "@acme/auth";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

import AccountSidebar from "@/components/layout/account/AccountSidebar";
import AccountTabs from "@/components/layout/account/AccountTabs";
import UserMenu from "@/components/layout/account/UserMenu";
import OrderStats from "@/components/layout/account/OrderStats";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(webAuthOptions);

  if (!requireAuth(session)) {
    redirect("/login");
  }

  const user = session?.user;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="absolute inset-0 h-screen -z-10">
        <Image
          src={`/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp`}
          alt="Asain Spices"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div className=" bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="container mx-auto px-4 py-10 flex-1">
          {/* HEADER */}
          
          <UserMenu email={user?.email} />

          {/* MOBILE TABS */}
          <AccountTabs />

          {/* STATS */}
          <OrderStats />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            
            <div className="hidden lg:block">
              <AccountSidebar />
            </div>

            {/* CONTENT */}
            <main className="bg-white rounded-2xl p-6 shadow-sm border min-h-100">
              {children}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}



// import Link from "next/link";
// import { User, MapPin, Package } from "lucide-react";
// import { cn } from "@/lib/utils";
//   const navItems = [
//     {
//       href: "/account/profile",
//       label: "Profile",
//       icon: User,
//     },
//     {
//       href: "/account/addresses",
//       label: "Addresses",
//       icon: MapPin,
//     },
//     {
//       href: "/account/orders",
//       label: "Orders",
//       icon: Package,
//     },
//   ];

            {/* <aside className="bg-white rounded-2xl p-4 shadow-sm border h-fit sticky top-24">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition",
                        "hover:bg-gray-100",
                      )}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside> */}

/* export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(webAuthOptions);

  if (!requireAuth(session)) {
    redirect("/login");
  }

  return (
    <div className="relative">
      <div>
        <Nav />
      </div>
      <div className="absolute inset-0 h-screen -z-10">
        <Image
          src={`/assets/home/homeheaderimages/a8de5a3724f7239b78cdee795f978b5faba485b4 (1).webp`}
          alt="Asain Spices"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div className=" bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="container mx-auto w-full">

          <div className=" mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome 
            </h1>
          </div>

          <aside className="w-64">
            <nav className="flex flex-col gap-3">
              <a href="/account/profile">Profile</a>
              <a href="/account/addresses">Addresses</a>
              <a href="/account/orders">Orders</a>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
 */
