import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 20,
      }}
      aria-label="Toggle theme"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
