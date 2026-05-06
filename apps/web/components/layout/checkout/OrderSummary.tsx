// apps/web/components/layout/checkout/OrderSummary.tsx

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartItem, useCartStore } from "@/store/useCartStore";
// import { SHIPPING_OPTIONS } from "@/components/ui/Checkout";

import { useCurrencyStore } from "@/store/useCurrencyStore";
import { SHIPPING_OPTIONS, ShippingMethod, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
// interface Props {
//   items: any[];
//   shippingMethod: "standard" | "express" | "overnight";
// }

interface Props {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// export const SHIPPING_OPTIONS = {
//   standard: { label: "Standard Shipping", price: 5.99 },
//   express: { label: "Express Shipping", price: 12.99 },
//   overnight: { label: "Overnight Shipping", price: 24.99 },
// } as const;

// export type ShippingMethod = keyof typeof SHIPPING_OPTIONS;

export default function OrderSummary({
  items,
  shippingMethod,
  subtotal,
  tax,
  shipping,
  total,
}: Props) {
  // const { cart, removeFromCart, clearCart, increaseQty, decreaseQty } =
  //   useCartStore();
  const { symbol, rate } = useCurrencyStore();

  // const shippingOption = SHIPPING_OPTIONS[shippingMethod];
  const isValidShippingMethod = (method: any): method is ShippingMethod => {
    return method in SHIPPING_OPTIONS;
  };

  const safeMethod: ShippingMethod = isValidShippingMethod(shippingMethod)
    ? shippingMethod
    : "standard";

  const shippingOption = SHIPPING_OPTIONS[safeMethod];
  const amountForFreeShipping =
    subtotal < FREE_SHIPPING_THRESHOLD
      ? FREE_SHIPPING_THRESHOLD - subtotal
      : 0;

  const hasFreeShipping = shipping === 0;


  const shippingPrice = shippingOption?.price ?? 0;

  // const subtotal = items.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0,
  // );

  // const TAX_RATE = 0.08;

  // const tax = subtotal * TAX_RATE;
  // let total = subtotal + tax + shippingPrice;
  // const itemInCart = cart.length;
  // let deliverDiffer = total < 50 ? 50 - total : undefined;

  // if (!deliverDiffer) total = total - shippingPrice;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <Image
                src={`/assets/home/premium_collection/268598abe4d4ba567742332ae571b20ea98ce9d9.jpg`}
                alt={item.title}
                fill
                className="object-cover"
              />
              {/* <span className="absolute top-0 -right-1 bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span> */}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.title} x {item.quantity}
              </p>
              {/* <p className="text-xs text-gray-500">{item.weight}</p> */}
              {/* <p className="text-xs text-gray-500">Qty: </p> */}
            </div>

            {/* <p className="text-sm font-medium">${item.price.toFixed(2)}</p> */}
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm py-5">
        <div className="flex justify-between mt-3">
          <span>Subtotal</span>
          <span>
            {symbol}
            {(rate * subtotal).toFixed(2)}
            {/* {subtotal.toFixed(2)} */}
          </span>
        </div>

        {/* SHIPPING */}
        <div className="flex justify-between mt-3">
          <span>Shipping ({shippingOption.label})</span>
          <span className={hasFreeShipping ? "text-[#00A63E]" : ""}>
            {hasFreeShipping
              ? "FREE"
              : `${symbol}${(rate * shipping).toFixed(2)}`}
          </span>
        </div>

        {/* {!deliverDiffer && (
          <>
            <div className="flex justify-between mt-3">
              <span>Shipping</span>
              <span className="text-[#00A63E]">FREE</span>
            </div>
          </>
        )}

        {deliverDiffer && (
          <>
            <div className="flex justify-between mt-3">
              <span>Shipping ({shippingOption.label})</span>
              <span>
                {symbol}
                {shippingOption.price.toFixed(2)}
              </span>
            </div>
          </>
        )} */}

        <div className="flex justify-between mt-3">
          <span>Tax (8%)</span>
          <span>
            {symbol}
            {(rate * tax).toFixed(2)}
            {/* {tax.toFixed(2)} */}
          </span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>
          {symbol}
          {(rate * total).toFixed(2)}
          {/* {total.toFixed(2)} */}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        {shippingMethod === "standard" && "Delivery in 5-7 days"}
        {shippingMethod === "express" && "Delivery in 2-3 days"}
        {shippingMethod === "overnight" && "Next day delivery"}
      </p>

      <div className="bg-white border-gray-200 py-5 border-b mb-6">
        <label
          htmlFor="promo-code"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Promo Code
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="promo-code"
            type="text"
            placeholder="Enter code"
            className="w-full sm:flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <button className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            Apply
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">Try: SPICE20 or WELCOME10</p>
      </div>

      {/* FREE SHIPPING CTA */}
      {!hasFreeShipping && amountForFreeShipping > 0 && (
        <>
          <div className="px-5 py-4 rounded-xl mt-5">
            <div className="text-[#F83600] flex items-center justify-center w-full">
              <ShoppingCart className="mr-3" />
              Add {symbol}
              {(rate * amountForFreeShipping).toFixed(2)} more for free shipping
            </div>
          </div>

          <div className="bg-linear-to-r from-[#FE8C00] to-[#F83600] px-5 py-4 rounded-xl mt-5">
            <Link href="/">
              <button className="cursor-pointer text-white flex items-center justify-center w-full">
                Continue Shopping
              </button>
            </Link>
          </div>
        </>
      )}

      {/* {deliverDiffer && (
        <>
          <div className=" px-5 py-4 rounded-xl mt-5">
            <div className="text-[#F83600] flex items-center justify-center w-full">
              <ShoppingCart className="mr-3" /> Add {symbol}
              {deliverDiffer.toFixed()}&nbsp;more for free shipping
            </div>
          </div>

          <div className="bg-linear-to-r from-[#FE8C00] to-[#F83600] px-5 py-4 rounded-xl mt-5">
            <Link href="/">
              <button className="cursor-pointer text-white flex items-center justify-center w-full">
                Continue Shopping
              </button>
            </Link>
          </div>
        </>
      )} */}
    </div>
  );
}

{
  /* {savings > 0 && (
              <div className="flex justify-between text-[#00A63E] mt-3">
                <span>You Save</span>
                <span>- ${savings.toFixed(2)}</span>
              </div>
            )} */
}
{
  /* 
      <div className="space-y-2 text-sm border-t border-[#E5E7EB] pt-4">
        <div className="flex justify-between text-gray-600">
          <span>{items.label}</span>
          <span>${items.value}</span>      
        </div>
      </div>
      <div className="flex justify-between text-lg font-semibold mt-6">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div> */
}
