/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import useThemeStore from '../store/themeStore';
import { LIGHT, DARK } from '../colors';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const dark = useThemeStore((s) => s.dark);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const colors = dark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
