// src/store/cartStore.ts
import { create } from "zustand";

type CartItem = {
  id: string;
  storeId: string;
  name: string;
  price: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (item: CartItem) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
  removeFromCart: (id: string) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ cart: [] }),
}));