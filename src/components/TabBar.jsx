import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useColors } from '../colors';

function GridIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#8B1A4A' : '#8A7A6B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function HeartIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#8B1A4A' : 'none'} stroke={active ? '#8B1A4A' : '#8A7A6B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.6L12 21l-7.5-8.4A5 5 0 1 1 12 7.1a5 5 0 1 1 7.5 5.5z" />
    </svg>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#8B1A4A' : '#8A7A6B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function InfoIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#8B1A4A' : '#8A7A6B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

const tabs = [
  { key: 'home', path: '/', label: 'Home', Icon: HomeIcon },
  { key: 'listing', path: '/listing', label: 'Catalogs', Icon: GridIcon },
  { key: 'wishlist', path: '/wishlist', label: 'Wishlist', Icon: HeartIcon },
  { key: 'about', path: '/about', label: 'About Us', Icon: InfoIcon },
];

const barStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-around',
  padding: '8px 12px',
  paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
  background: '#FFFFFF',
  borderTop: '1px solid #E8E0D8',
  boxShadow: '0 -2px 8px rgba(15,38,64,0.06)',
};

const tabStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  padding: '6px 12px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  position: 'relative',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: 11,
  letterSpacing: '0.5px',
  textTransform: 'uppercase' ,
};

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const C = useColors();

  const currentPath = location.pathname;
  const activeTab = tabs.find(t => t.path === currentPath)?.key;

  return (
    <div style={barStyle}>
      {tabs.map(tab => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            style={{
              ...tabStyle,
              color: isActive ? C.BURGUNDY : C.MUTED,
              fontWeight: isActive ? 600 : 400,
            }}
            onClick={() => navigate(tab.path)}
          >
            <tab.Icon active={isActive} />
            <span>{tab.label}</span>
            {tab.key === 'listing' && cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: '50%',
                marginRight: -32,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                background: '#B8860B',
                color: '#fff',
                fontSize: 9,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                lineHeight: 1,
              }}>
                {cart.length > 99 ? '99+' : cart.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
