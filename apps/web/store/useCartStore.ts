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
  addToCart: (item: Omit<CartItem, "quantity">) => void;


  setCart: (items: CartItem[]) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
}

export const useCartStore = create<CartState>()(
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

      // addToCart: (item) => {
      //   console.log(item);
      //   const existing = get().cart.find((i) => i.id === item.id);

      //   if (existing) {
      //     set({
      //       cart: get().cart.map((i) =>
      //         i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
      //       ),
      //     });
      //   } else {
      //     set({
      //       cart: [...get().cart, { ...item, quantity: 1 }],
      //     });
      //   }
      // },

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
);
