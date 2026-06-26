import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i._id === item._id);
          return {
            items: exists
              ? state.items.filter((i) => i._id !== item._id)
              : [...state.items, item],
          };
        }),
      has: (id) => get().items.some((i) => i._id === id),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'pmj-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWishlistStore;
