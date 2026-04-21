// apps/web/components/ui/Cart.tsx

"use client";

import Image from "next/image";
import { Heart, Trash2, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ArrowRight } from "lucide-react";
import { useCurrencyStore } from "@/store/useCurrencyStore";

import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

const FALLBACK_IMAGE = "/images/placeholder.png";

export default function Cart() {
  const { cart, removeFromCart, clearCart, increaseQty, decreaseQty } =
    useCartStore();

  const { addToWishlist } = useWishlistStore();
  const { symbol, rate } = useCurrencyStore();

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // const { data: session } = useSession();
  const router = useRouter();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  console.log(cart);

  const TAX_RATE = 0.08;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax; // shipping free, tax ignored for now
  const itemInCart = cart.length;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">🛒 Your cart is empty</p>
    );
  }

  return (
    <div className="bg-white p-8">
      <div className="p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base">
          <Link href={"/"}>
            <p className="text-[#6A7282]">Home</p>
          </Link>
          <p className="text-[#6A7282]"> / </p>
          <p className="text-[#6A7282]">Shopping Cart</p>
        </div>

        {/* Title */}
        <div className="mt-4 sm:mt-5">
          <h1 className="font-bold text-3xl sm:text-5xl">Shopping Cart</h1>
        </div>

        {/* Item count */}
        <div className="mt-3 sm:mt-5">
          <h1 className="font-bold text-lg sm:text-xl">
            {itemInCart} items in your cart
          </h1>
        </div>
      </div>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white">
        {/* LEFT - CART ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5"
            >
              {/* IMAGE */}
              <div className="h-30 w-full sm:w-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {/* src={`${item.image}`}
                  alt={item.title} */}
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title || "Product"}
                  width={96}
                  height={96}
                  className="object-cover h-full w-full"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {/* <p className="text-sm text-gray-500">
                      Weight: {item.weight}
                    </p> */}
                    <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                      In Stock
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold">
                      {symbol}
                      {(rate * (item.price * item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* QTY */}
                  <div className="flex items-center border rounded-lg w-fit">
                    <button
                      onClick={() => decreaseQty(item.id, isLoggedIn)}
                      className="px-3 py-1 text-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id, isLoggedIn)}
                      className="px-3 py-1 text-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* ICONS */}
                  <div className="flex items-center gap-4 text-gray-500 flex-wrap">
                    <button
                      className="flex items-center gap-1 cursor-pointer"
                      // onClick={() => addToWishlist(item)}
                    >
                      <Heart size={16} /> Save
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, isLoggedIn)}
                      className="flex items-center gap-1 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm py-5">
            <div className="flex justify-between mt-3">
              <span>Subtotal</span>
              <span>
                {symbol}
                {(rate * subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mt-3">
              <span>Tax (8%)</span>
              <span>
                {symbol}
                {(rate * tax).toFixed(2)}
              </span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              {symbol}
              {(rate * total).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="cursor-pointer w-full mt-5 bg-linear-to-r from-[#FF6900] to-[#F83701] hover:bg-orange-600 text-white py-3 rounded-xl flex items-center justify-center"
          >
            Proceed to Checkout
            <ArrowRight className="text-white ml-4 size-[20]" />
          </button>

          <Link href={"/"}>
            <button className="w-full mt-3 border py-3 rounded-xl text-sm cursor-pointer">
              Continue Shopping
            </button>
          </Link>

          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              Secure Checkout
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-orange-500" />
              Free Shipping on orders over {symbol}({(rate * 50).toFixed(2)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* const handleCheckout = () => {
    if (!session) {
      // 🔥 store intent
      localStorage.setItem("checkout_redirect", "/checkout");

      router.push("/login");
      return;
    }

    router.push("/checkout");
  };
  
  
  // const savings = cart.reduce((acc, item) => {
  //   if (!item.oldPrice) return acc;
  //   return acc + (item.oldPrice - item.price) * item.quantity;
  // }, 0);
  
  */

{
  /* {item.oldPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ${(item.oldPrice * item.quantity).toFixed(2)}
                      </p>
                    )} */
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
  /* <div className="flex justify-between mt-3">
              <span>Shipping</span>
              <span className="text-[#00A63E]">FREE</span>
            </div> */
}

{
  /* <button className="cursor-pointer w-full mt-5 bg-linear-to-r from-[#FF6900] to-[#F83701] hover:bg-orange-600 text-white py-3 rounded-xl font-medium flex items-center justify-center">
            <Link href="/checkout"> Proceed to Checkout </Link>
            <ArrowRight className="text-white ml-4 size-[20]" />
          </button> */
}
