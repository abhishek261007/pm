import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],

  addToCart: (item) => {
    const alreadyInCart = get().items.some((i) => i._id === item._id);
    if (alreadyInCart) return;
    set((state) => ({ items: [...state.items, item] }));
  },

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));

export default useCartStore;
