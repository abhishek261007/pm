import { CartProvider } from './CartContext';
import { ThemeProvider } from './ThemeContext';

export function AppContextProvider({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}