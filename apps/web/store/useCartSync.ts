// apps/web/store/useCartSync.ts

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

export const useCartSync = () => {
  const { data: session, status } = useSession();
  const { cart, clearCart, setCart } = useCartStore();

  useEffect(() => {
    if (status !== "authenticated") return;

    const syncCart = async () => {
      try {
        // 🔁 STEP 4: merge local cart → DB
        if (cart.length > 0) {
          for (const item of cart) {
            await fetch("/api/cart", {
              method: "POST",
              body: JSON.stringify({
                product_id: item.id,
                price: item.price,
                quantity: item.quantity,
              }),
            });
          }

          clearCart(); // 🧹 clear local after merge
        }

        // 🔁 STEP 3: fetch DB cart
        const res = await fetch("/api/cart");
        const dbCart = await res.json();

        if (dbCart?.length) {
          const formattedCart = dbCart.map((item: any) => ({
            id: item.product_id,
            title: item.title || "Product", // adjust if needed
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image || "",
          }));

          setCart(formattedCart);
        }
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    };

    syncCart();
  }, [status, cart]);
};
