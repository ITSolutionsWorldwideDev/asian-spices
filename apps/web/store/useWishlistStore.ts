import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: number;
  title: string;
  image: string;
  price?: number;
  oldPrice?: number | null;
  tag?: string;
  off?: string;
  rating?: number;
  reviews?: number;
  left?: number;
  description?: string;
  weight?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeFromWishlist: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      toggleWishlist: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set((state) => ({
          items: exists
            ? state.items.filter((i) => i.id !== item.id)
            : [...state.items, item],
        }));
      },

      isInWishlist: (id) => get().items.some((item) => item.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage", // key in localStorage
    },
  ),
);
