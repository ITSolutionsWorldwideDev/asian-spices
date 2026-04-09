// apps/web/app/checkout/success/page.tsx

import React from "react";
import CheckoutSuccess from "@/components/ui/CheckoutSuccess";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/ui/Nav";

interface Props {
  searchParams: { orderId?: string };
}

const page = ({ searchParams }: Props) => {
  const { orderId } = searchParams;

  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        </div>
        {orderId ? (
          <CheckoutSuccess orderId={orderId} />
        ) : (
          <p>No order specified</p>
        )}
      </div>
    </div>
  );
};

export default page;
