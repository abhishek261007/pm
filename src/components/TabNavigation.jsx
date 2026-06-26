import { useTheme } from '../context/ThemeContext';
import useCartStore from '../store/cartStore';
import { useColors } from '../colors';

const tabBarStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '12px 16px',
  borderTop: '1px solid #E0E0E0',
  background: '#FFFFFF',
  boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 100,
};

const tabStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: '6px 12px',
  gap: 4,
};

export function TabNavigation({ activeTab, onTabChange }) {
  const { dark, toggleTheme } = useTheme();
  const C = useColors();
  const cartCount = useCartStore((s) => s.items.length);

  const tabs = [
    { key: 'catalog', label: 'Catalog' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'about', label: 'About' },
  ];

  return (
    <div style={tabBarStyle}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            style={{
              ...tabStyle,
              color: isActive ? C.BURGUNDY : C.MUTED,
              fontWeight: isActive ? 600 : 400,
            }}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            {tab.key === 'catalog' && cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                background: C.GOLD_DEEP,
                color: '#fff',
                fontSize: 9,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        );
      })}
      <button
        onClick={toggleTheme}
        style={{
          ...tabStyle,
          fontSize: 20,
          cursor: 'pointer',
        }}
        aria-label="Toggle theme"
      >
        {dark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
