import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useColors } from '../colors';

function GridIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function HeartIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#fff' : 'none'} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.6L12 21l-7.5-8.4A5 5 0 1 1 12 7.1a5 5 0 1 1 7.5 5.5z" />
    </svg>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function InfoIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

const itemColors = [
  { bg: '#3B82F6', hover: '#2563EB' },
  { bg: '#8B5CF6', hover: '#7C3AED' },
  { bg: '#EC4899', hover: '#DB2777' },
  { bg: '#14B8A6', hover: '#0D9488' },
];

const spring = { type: 'spring', bounce: 0.3, duration: 0.55 };

const itemVariants = {
  hidden: { opacity: 0, scale: 0.6, x: -8 },
  visible: (i) => ({
    opacity: 1, scale: 1, x: 0,
    transition: { type: 'spring', bounce: 0.2, duration: 0.4, delay: i * 0.04 },
  }),
  exit: { opacity: 0, scale: 0.6, x: -8, transition: { duration: 0.15 } },
};

function HamburgerToggle({ open }) {
  return (
    <motion.div
      style={{
        width: 20,
        height: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <motion.span
        animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={spring}
        style={{ display: 'block', width: 18, height: 2, background: '#fff', borderRadius: 1 }}
      />
      <motion.span
        animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'block', width: 18, height: 2, background: '#fff', borderRadius: 1 }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={spring}
        style={{ display: 'block', width: 18, height: 2, background: '#fff', borderRadius: 1 }}
      />
    </motion.div>
  );
}

export default function TabBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  const currentPath = location.pathname;
  const activeTab = tabs.find(t => t.path === currentPath)?.key;

  function handleNavigate(path) {
    navigate(path);
    setOpen(false);
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        layout
        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: open ? 4 : 0,
          background: 'rgba(15, 15, 20, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 40,
          padding: open ? '6px 6px' : '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
        onClick={() => !open && setOpen(true)}
      >
        <motion.div
          layout
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => {
            if (open) { e.stopPropagation(); setOpen(false); }
          }}
        >
          <HamburgerToggle open={open} />
        </motion.div>

        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {tabs.map((tab, i) => {
              const isActive = tab.key === activeTab;
              const colors = itemColors[i];
              return (
                <motion.button
                  key={tab.key}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: isActive ? '7px 14px' : '7px 10px',
                    border: 'none',
                    borderRadius: 30,
                    background: isActive ? colors.bg : 'transparent',
                    color: '#fff',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.3px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  whileHover={{ background: isActive ? colors.hover : 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(tab.path);
                  }}
                >
                  <tab.Icon active={isActive} />
                  {tab.label}
                  {tab.key === 'listing' && cart.length > 0 && (
                    <span style={{
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      background: '#F59E0B',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      lineHeight: 1,
                    }}>
                      {cart.length > 99 ? '99+' : cart.length}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
