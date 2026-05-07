// apps/web/store/useCartSync.ts

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

export const useCartSync = () => {
  const { data: session, status } = useSession();
  const { cart, clearCart, setCart } = useCartStore();

  const hasSynced = useRef(false); // ✅ prevent loop

  useEffect(() => {
    if (status !== "authenticated" || hasSynced.current) return;

    const syncCart = async () => {
      try {
        /* ---------------- MERGE LOCAL → DB ---------------- */

        /* if (cart.length > 0) {
          await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }),
          });

          clearCart(); // 🧹 clear local
        } */

        /* ---------------- FETCH DB CART ---------------- */

        const res = await fetch("/api/cart");
        const dbCart = await res.json();

        console.log('dbCart === ',dbCart);

        const formatted = dbCart.map((item: any) => ({
          id: item.product_id,
          title: item.title || "Product",
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image || "",
        }));

        setCart(formatted);

        hasSynced.current = true; // ✅ prevent re-run
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    };

    syncCart();
  }, [status]);
};
