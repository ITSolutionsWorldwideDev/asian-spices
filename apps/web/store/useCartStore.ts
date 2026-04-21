// apps/web/store/useCartStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  // weight?: string;
  // oldPrice: number | null;
  // weight: string;
}



interface CartState {
  cart: CartItem[];

  addToCart: (item: Omit<CartItem, "quantity">, isLoggedIn: boolean) => void;
  removeFromCart: (id: string, isLoggedIn: boolean) => void;

  increaseQty: (id: string, isLoggedIn: boolean) => void;
  decreaseQty: (id: string, isLoggedIn: boolean) => void;

  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: async (item, isLoggedIn) => {
        const existing = get().cart.find((i) => i.id === item.id);

        let updatedCart;

        if (existing) {
          updatedCart = get().cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedCart = [...get().cart, { ...item, quantity: 1 }];
        }

        set({ cart: updatedCart });

        // ✅ Only sync if logged in
        if (!isLoggedIn) return;

        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: item.id,
              // price: item.price,
              quantity: 1,
            }),
          });
        } catch (err) {
          console.error("Cart sync failed", err);
        }
      },

      /* ---------------- REMOVE ---------------- */
      removeFromCart: async (id, isLoggedIn) => {
        set({
          cart: get().cart.filter((i) => i.id !== id),
        });

        if (!isLoggedIn) return;

        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: id }),
        });
      },

      /* ---------------- INCREASE ---------------- */
      increaseQty: async (id, isLoggedIn) => {
        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });

        if (!isLoggedIn) return;

        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: id,
            quantity: 1,
          }),
        });
      },

      /* ---------------- DECREASE ---------------- */
      decreaseQty: async (id, isLoggedIn) => {
        const item = get().cart.find((i) => i.id === id);
        if (!item) return;

        if (item.quantity === 1) {
          return get().removeFromCart(id, isLoggedIn);
        }

        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          ),
        });

        if (!isLoggedIn) return;

        await fetch("/api/cart/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: id,
            quantity: -1,
          }),
        });
      },

      setCart: (items) => set({ cart: items }),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);

// interface CartState {
//   cart: CartItem[];
//   addToCart: (item: Omit<CartItem, "quantity">) => void;


//   setCart: (items: CartItem[]) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
//   increaseQty: (id: string) => void;
//   decreaseQty: (id: string) => void;
// }


/* export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: async (item) => {
        const existing = get().cart.find((i) => i.id === item.id);

        let updatedCart;

        if (existing) {
          updatedCart = get().cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          updatedCart = [...get().cart, { ...item, quantity: 1 }];
        }

        set({ cart: updatedCart });

        // 🔐 Sync with backend
        try {
          await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({
              product_id: item.id,
              price: item.price,
              quantity: 1,
            }),
          });
        } catch (err) {
          console.error("Cart sync failed", err);
        }
      },

      setCart: (items) => set({ cart: items }),

      removeFromCart: (id) =>
        set({
          cart: get().cart.filter((i) => i.id !== id),
        }),

      clearCart: () => set({ cart: [] }),

      increaseQty: (id) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          cart: state.cart
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),
    }),

    // }),
    {
      name: "cart-storage", // 🔑 key in localStorage
      version: 1,
    },
  ),
); */
