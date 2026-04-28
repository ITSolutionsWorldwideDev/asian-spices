// apps/web/app/checkout/success/page.tsx

import Nav from "@/components/ui/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CheckoutStatus from "@/components/ui/CheckoutStatus";
import PayPalCaptureHandler from "@/components/ui/PayPalCaptureHandler";

interface Props {
  searchParams: {
    orderId?: string;
    token?: string;
  };
}

export default function Page({ searchParams }: Props) {
  const { orderId, token } = searchParams;

  return (
    <div>
      <div className="bg-black">
        <Nav />
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>

          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        </div>

        {!orderId ? (
          <p>No order specified</p>
        ) : (
          <>
            {/* ✅ PayPal only handler */}
            {token && <PayPalCaptureHandler orderId={orderId} token={token} />}

            {/* ✅ Unified status UI (PayPal + Pay.nl) */}
            <CheckoutStatus orderId={orderId} />
          </>
        )}
      </div>
    </div>
  );
}

// import CheckoutSuccess from "@/components/ui/CheckoutSuccess";

/* interface Props {
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

        <div className="mb-10">
          <Link href="/cart">
            <p className="text-sm text-gray-500 flex items-center cursor-pointer">
              <ArrowLeft className="size-[15]" /> Back to Cart
            </p>
          </Link>
          <h1 className="text-2xl font-semibold mt-2">Checkout</h1>
        </div>
        {orderId ? (
          // <CheckoutSuccess orderId={orderId} />
          <CheckoutStatus orderId={orderId} />
        ) : (
          <p>No order specified</p>
        )}
      </div>
    </div>
  );
};

export default page;
 */
