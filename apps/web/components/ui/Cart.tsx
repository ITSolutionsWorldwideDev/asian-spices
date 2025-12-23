"use client";

import { useCartStore } from "@/store/useCartStore";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCartStore();

  if (cart.length === 0) {
    return <p className="text-gray-500">Cart is empty</p>;
  }

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <h2 className="text-xl font-bold">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">
              ₹{item.price} × {item.quantity}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={clearCart}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Clear Cart
      </button>
    </div>
  );
}
