/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const hasWishlist = useWishlistStore((s) => s.has);
  const removeFromWishlist = useWishlistStore((s) => s.remove);
  const clearWishlist = useWishlistStore((s) => s.clear);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        wishlistItems,
        toggleWishlist,
        hasWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}