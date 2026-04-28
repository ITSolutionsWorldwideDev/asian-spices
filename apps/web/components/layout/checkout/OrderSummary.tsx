// apps/web/components/layout/checkout/OrderSummary.tsx

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { SHIPPING_OPTIONS } from "@/components/ui/Checkout";

interface Props {
  items: any[];
  shippingMethod: "standard" | "express" | "overnight";
}

export default function OrderSummary({ items, shippingMethod }: Props) {
  const { cart, removeFromCart, clearCart, increaseQty, decreaseQty } =
    useCartStore();

  /* const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  ); */

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shippingPrice = SHIPPING_OPTIONS[shippingMethod].price;

  // const savings = cart.reduce((acc, item) => {
  //   if (!item.oldPrice) return acc;
  //   return acc + (item.oldPrice - item.price) * item.quantity;
  // }, 0);

  const TAX_RATE = 0.08;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + shippingPrice;
  const itemInCart = cart.length;
  let deliverDiffer = total < 50 ? 50 - total : undefined;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <h2 className="font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <Image
                src={`/assets/home/premium_collection/268598abe4d4ba567742332ae571b20ea98ce9d9.jpg`}
                alt={item.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-0 -right-1 bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.weight}</p>
            </div>

            {/* <p className="text-sm font-medium">${item.price.toFixed(2)}</p> */}
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm py-5">
        <div className="flex justify-between mt-3">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* {savings > 0 && (
              <div className="flex justify-between text-[#00A63E] mt-3">
                <span>You Save</span>
                <span>- ${savings.toFixed(2)}</span>
              </div>
            )} */}
        {!deliverDiffer && (
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
              <span>Shipping ({SHIPPING_OPTIONS[shippingMethod].label})</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
          </>
        )}

        <div className="flex justify-between mt-3">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* 
      <div className="space-y-2 text-sm border-t border-[#E5E7EB] pt-4">
        <div className="flex justify-between text-gray-600">
          <span>{items.label}</span>
          <span>${items.value}</span>      
        </div>
      </div>
      <div className="flex justify-between text-lg font-semibold mt-6">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div> */}

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

      {deliverDiffer && (
        <>
          <div className="bg-linear-to-r from-[#FE8C00] to-[#F83600] px-5 py-4 rounded-xl mt-5">
            <button className="text-white flex items-center justify-center w-full">
              <ShoppingCart className="mr-3" /> Add {deliverDiffer.toFixed()} $
              more for free shipping
            </button>
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
    </div>
  );
}
