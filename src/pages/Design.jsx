import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import useWishlistStore from '../store/wishlistStore';
import SEO, { createProductSchema } from '../components/SEO';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .design-root {
    height: 100dvh;
    overflow: hidden;
    background: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 300;
    color: #2C1810;
    -webkit-font-smoothing: antialiased;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* ── GRADIENT HEADER ── */
  .header-block {
    background: linear-gradient(135deg, #8B1A4A, #1B3A5C, #4A8B7C);
    padding: calc(16px + env(safe-area-inset-top, 36px)) 16px 16px;
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }
  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .back-btn {
    width: 44px; height: 44px;
    border-radius: 14px;
    background: rgba(255,255,255,0.18);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin-top: 4px;
    flex-shrink: 0;
  }
  .back-glyph {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 300;
    font-size: 20px;
    color: #FFFFFF;
    line-height: 22px;
  }
  .header-titles {
    flex: 1;
    overflow: hidden;
  }
  .header-eyebrow {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.85);
    margin-bottom: 2px;
  }
  .header-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 28px;
    font-weight: 200;
    color: #FFFFFF;
    letter-spacing: -0.5px;
    line-height: 30px;
  }
  .counter-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .counter-text {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    letter-spacing: 1px;
  }
  .header-cart-btn {
    width: 64px; height: 64px;
    border-radius: 14px;
    background: rgba(255,255,255,0.15);
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    text-decoration: none;
    flex-shrink: 0;
    position: relative;
  }
  .header-cart-btn span:first-child { font-size: 22px !important; line-height: 1 !important; }
  .header-cart-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
  }

  /* ── PAGE BODY ── */
  .page-body {
    padding: 12px 12px 16px;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  /* ── SWIPE AREA ── */
  .swipe-area {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* ── IMAGE ── */
  .image-wrap {
    background: #FFFBF4;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    margin-bottom: 12px;
    flex: 1;
    min-height: 0;
  }
  .design-image {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
  }
  .wishlist-btn {
    position: absolute; top: 12px; right: 12px;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.9); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.4rem; line-height: 1;
    z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .wishlist-btn.active { color: #C53030; }
  .wishlist-btn.inactive { color: #C8C8C4; }

  /* ── NAV ARROWS ── */
  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.85);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #2C1810;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0,0,0,0.12);
    transition: opacity 0.2s ease;
  }
  .nav-arrow:active { opacity: 0.6; }
  .nav-arrow.prev { left: 8px; }
  .nav-arrow.next { right: 8px; }

  /* ── INFO CARD ── */
  .info-card {
    background: #FFFBF4;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    padding: 16px;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  /* Specs grid */
  .specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .spec-cell {
    background: #F5F0EB;
    border-radius: 10px;
    padding: 10px;
  }
  .spec-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 4px;
  }
  .spec-value {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.2rem;
    font-weight: 200;
    color: #2C1810;
    line-height: 1;
  }
  /* ── ACTIONS ── */
  .actions-card {
    display: flex;
    flex-shrink: 0;
  }
  .btn-cart {
    width: 100%; height: 56px;
    border: none; cursor: pointer;
    background: #2C1810;
    color: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 8px;
    transition: transform 0.1s ease, opacity 0.2s ease;
  }
  .btn-cart:hover { opacity: 0.85; }
  .btn-cart:active { transform: scale(0.96); opacity: 0.75; }

  /* ── STATES ── */
  .centered-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: calc(100vh - 100px);
    gap: 1.5rem; text-align: center;
  }
  .loader-wrap { display: flex; gap: 8px; }
  .loader-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #C8C8C4;
    animation: pulse 1.4s ease infinite;
  }
  .loader-dot:nth-child(2) { animation-delay: 0.2s; }
  .loader-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40%           { opacity: 1;   transform: scale(1); }
  }
  .error-text {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 2rem; font-weight: 200; font-style: italic;
    color: #C8C8C4;
  }

  /* ── TOAST ── */
  /* ── FLY TO CART ── */
  @keyframes flyCart {
    0% { transform: translate(var(--from-x), var(--from-y)) scale(1); opacity: 1; }
    70% { opacity: 1; }
    100% { transform: translate(var(--to-x), var(--to-y)) scale(0.3); opacity: 0; }
  }
  .fly-dot {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #8B1A4A;
    top: 0;
    left: 0;
    animation: flyCart 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .toast {
    position: fixed; bottom: 2rem; right: 2rem;
    padding: 0.75rem 1.25rem;
    background: #2C1810; color: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px; letter-spacing: 1.5px;
    text-transform: uppercase;
    z-index: 1000;
    animation: toastIn 0.3s ease, toastOut 0.3s ease 1.7s forwards;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }

  /* ── SLIDE TRANSITION ── */
  @keyframes slideInNext {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInPrev {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .slide-next { animation: slideInNext 0.25s ease-out; }
  .slide-prev { animation: slideInPrev 0.25s ease-out; }

  /* ── IMAGE ZOOM MODAL ── */
  .zoom-overlay {
    position: fixed;
    inset: 0;
    z-index: 10001;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
  }
  .zoom-close {
    position: fixed;
    top: calc(16px + env(safe-area-inset-top, 20px));
    right: 16px;
    z-index: 10002;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #FFFFFF;
  }
  .zoom-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-select: none;
    transition: transform 0.05s linear;
    will-change: transform;
  }

  /* ── RESPONSIVE ── */
  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; }
  }

  /* ── PRODUCT CONTENT ── */
  .product-content {
    background: #FFFBF4;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    padding: 16px;
    margin-bottom: 12px;
  }
  .product-content h1 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #2C1810;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .product-description {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #4A4A4A;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  .product-features {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
  }
  .product-features li {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #2C1810;
    padding: 6px 0;
    border-bottom: 1px solid #F0E8E0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .product-features li:last-child { border-bottom: none; }
  .feature-icon { color: #8B1A4A; font-size: 10px; }
  .product-section-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 8px;
  }
  .care-text {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #6A6A6A;
    line-height: 1.5;
  }

  /* ── RELATED DESIGNS ── */
  .related-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #F0E8E0;
  }
  .related-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .related-card {
    background: #F5F0EB;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .related-card:active { transform: scale(0.96); }
  .related-img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    display: block;
  }
  .related-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9px;
    font-weight: 500;
    color: #8A7A6B;
    padding: 4px 6px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// Resolve the catalog name from all available sources, in priority order:
// 1. Router state (passed via Link from Catalog page)
// 2. design.catalogName (flat field some APIs return)
// 3. design.catalog.name (populated relation)
// 4. Empty string (Cart.jsx falls back to 'Collection' itself)
function resolveCatalogName(stateValue, design) {
  if (stateValue && stateValue !== 'Pure Silver · Handcrafted') return stateValue;
  if (design?.catalogName) return design.catalogName;
  if (design?.catalog?.name) return design.catalog.name;
  return stateValue || '';
}

// Generate contextual product content based on catalog name and product attributes
function generateProductContent(catalogName, design) {
  const name = (catalogName || '').toLowerCase();
  const sku = design?.sku || '';
  const weight = design?.weight || '';

  // Category-specific content
  const categories = {
    juda: {
      type: 'Hair Accessory',
      features: ['Antique silver finish', 'Handcrafted', 'Bridal and festive design', 'Oxidized detailing', 'Premium quality'],
      description: `This handcrafted silver juda is designed for bridal, festive, and traditional occasions. The intricate silver work and oxidized finish provide a classic appearance suitable for weddings, Navratri, and cultural events.`,
      usage: 'Ideal for weddings, festive celebrations, traditional ceremonies, and cultural events.',
      care: 'Store in a dry place. Avoid contact with perfumes and chemicals. Clean gently with a soft cloth.',
    },
    payal: {
      type: 'Anklet',
      features: ['Traditional silver payal', 'Handcrafted', 'Comfortable fit', 'Oxidized finish', 'Wholesale available'],
      description: `This silver payal is handcrafted with traditional motifs and an oxidized finish. Designed for daily wear and special occasions, it adds elegance to both traditional and contemporary outfits.`,
      usage: 'Perfect for daily wear, festivals, weddings, and traditional ceremonies.',
      care: 'Avoid water and moisture. Store separately to prevent tangling. Clean with a dry soft cloth.',
    },
    kamarband: {
      type: 'Waist Chain',
      features: ['Silver kamarband', 'Traditional design', 'Adjustable fit', 'Handcrafted', 'Bridal accessory'],
      description: `This silver kamarband (waist chain) is designed with traditional Indian motifs. Handcrafted with precision, it is a classic bridal accessory that complements lehengas and sarees.`,
      usage: 'Ideal for weddings, bridal attire, traditional ceremonies, and festive occasions.',
      care: 'Handle with care. Store in a jewelry box. Avoid contact with water and chemicals.',
    },
    purse: {
      type: 'Clutch',
      features: ['Silver purse', 'Antique design', 'Handcrafted', 'Party wear', 'Ethnic accessory'],
      description: `This silver purse features antique silver work and intricate detailing. A premium accessory for parties, weddings, and festive occasions, it combines traditional craftsmanship with modern functionality.`,
      usage: 'Perfect for parties, weddings, festive events, and special occasions.',
      care: 'Store in a dry place. Avoid exposure to moisture. Clean with a soft dry cloth.',
    },
    bangles: {
      type: 'Bangle',
      features: ['Silver bangles', 'Handcrafted', 'Traditional design', 'Oxidized finish', 'Wholesale available'],
      description: `These silver bangles are handcrafted with traditional patterns and an oxidized finish. Suitable for daily wear and special occasions, they add a touch of elegance to any outfit.`,
      usage: 'Ideal for daily wear, festivals, weddings, and traditional events.',
      care: 'Avoid dropping. Store in a bangle stand or soft cloth. Clean with a dry cloth.',
    },
    necklace: {
      type: 'Necklace',
      features: ['Silver necklace', 'Traditional design', 'Handcrafted', 'Oxidized finish', 'Premium quality'],
      description: `This silver necklace is crafted with intricate traditional motifs and an oxidized finish. A statement piece for weddings, festivals, and cultural celebrations.`,
      usage: 'Perfect for weddings, festive occasions, traditional ceremonies, and special events.',
      care: 'Store in a jewelry box. Avoid contact with perfumes and chemicals. Clean gently.',
    },
    earrings: {
      type: 'Earrings',
      features: ['Silver earrings', 'Handcrafted', 'Traditional design', 'Comfortable wear', 'Oxidized finish'],
      description: `These silver earrings feature traditional designs with an oxidized finish. Handcrafted for comfort and style, they complement both traditional and modern outfits.`,
      usage: 'Suitable for daily wear, festivals, weddings, and special occasions.',
      care: 'Store in an earring holder. Avoid contact with water and chemicals.',
    },
    rings: {
      type: 'Ring',
      features: ['Silver ring', 'Adjustable', 'Handcrafted', 'Traditional design', 'Premium quality'],
      description: `This silver ring is handcrafted with traditional motifs and an oxidized finish. An adjustable design ensures a comfortable fit for various occasions.`,
      usage: 'Ideal for daily wear, festivals, weddings, and casual outings.',
      care: 'Avoid water and chemicals. Store separately. Clean with a soft cloth.',
    },
  };

  // Find matching category
  let matched = null;
  for (const [key, content] of Object.entries(categories)) {
    if (name.includes(key)) {
      matched = content;
      break;
    }
  }

  // Default content if no category match
  if (!matched) {
    matched = {
      type: 'Silver Jewellery',
      features: ['Handcrafted silver', 'Premium quality', 'Oxidized finish', 'Traditional design', 'Wholesale available'],
      description: `This handcrafted silver jewellery piece from PM Jewellers features traditional Indian design with an oxidized finish. Made with pure silver, it is suitable for weddings, festivals, and everyday elegance.`,
      usage: 'Perfect for weddings, festivals, traditional events, and daily wear.',
      care: 'Store in a dry place. Avoid contact with perfumes and chemicals. Clean with a soft cloth.',
    };
  }

  return matched;
}

// Generate related designs text
function getRelatedDesignsText(catalogName) {
  const name = (catalogName || '').toLowerCase();
  if (name.includes('juda')) return 'More Silver Juda Designs';
  if (name.includes('payal')) return 'More Silver Payal Designs';
  if (name.includes('kamarband')) return 'More Kamarband Designs';
  if (name.includes('purse')) return 'More Silver Purse Designs';
  if (name.includes('bangle')) return 'More Silver Bangles';
  if (name.includes('necklace')) return 'More Silver Necklace Designs';
  if (name.includes('earring')) return 'More Silver Earrings';
  if (name.includes('ring')) return 'More Silver Rings';
  return 'More Silver Jewellery Designs';
}

export default function Design() {
  const { id } = useParams();
  const { state } = useLocation();
  const { addToCart } = useCart();

  const [design, setDesign] = useState(null);
  const catalogIdFromDesign = design?.catalogId || design?.catalog?._id || design?.catalog;
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const cartRef = useRef(null);
  const [flyItems, setFlyItems] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDir, setSlideDir] = useState('next');
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchOnInteractive = useRef(false);

  const [modalImageUrl, setModalImageUrl] = useState(null);
  const modalScale = useRef(1);
  const modalTranslateX = useRef(0);
  const modalTranslateY = useRef(0);
  const modalLastTouchDist = useRef(0);
  const modalLastTouchX = useRef(0);
  const modalLastTouchY = useRef(0);
  const modalTouching = useRef(false);
  const [modalTransform, setModalTransform] = useState('none');

  const openModal = useCallback((url) => {
    modalScale.current = 1;
    modalTranslateX.current = 0;
    modalTranslateY.current = 0;
    setModalTransform('none');
    setModalImageUrl(url);
  }, []);

  const closeModal = useCallback(() => {
    setModalImageUrl(null);
  }, []);

  const addFlyItem = useCallback((btnEl) => {
    if (!cartRef.current) return;
    const btn = btnEl.getBoundingClientRect();
    const cart = cartRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setFlyItems((prev) => [...prev, {
      id,
      fromX: btn.left + btn.width / 2,
      fromY: btn.top,
      toX: cart.left + cart.width / 2,
      toY: cart.top,
    }]);
    setTimeout(() => {
      setFlyItems((prev) => prev.filter((f) => f.id !== id));
    }, 600);
  }, []);

  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const hasWishlist = useCallback(
    (id) => wishlistItems.some((i) => i._id === id),
    [wishlistItems]
  );

  const fetchDesign = async () => {
    try {
      const res = await api.get(`/public/design/${id}`);
      setDesign(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesigns = async (catalogId) => {
    if (!catalogId) return;
    try {
      const res = await api.get(`/public/designs?catalogId=${catalogId}`);
      const all = Array.isArray(res.data) ? res.data : [];
      const available = all.filter((d) => d.status === 'available');

      setDesigns(available);
      const idx = available.findIndex((d) => d._id === id);
      if (idx !== -1) setActiveIndex(idx);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchDesign();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (catalogIdFromDesign) fetchDesigns(catalogIdFromDesign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogIdFromDesign]);

  const currentDesign = designs.length > 0 ? designs[activeIndex] : design;
  const catalogName = resolveCatalogName(state?.catalogName, currentDesign);
  const hasPrev = activeIndex > 0;

  useEffect(() => {
    if (currentDesign?.sku) {
      document.title = `${catalogName} ${currentDesign.sku} — Silver Antique Juda`;
    } else {
      document.title = 'Silver Antique Juda — Handcrafted Silver';
    }
  }, [currentDesign, catalogName]);
  const hasNext = activeIndex < designs.length - 1;

  const goTo = useCallback((idx) => {
    setSlideDir(idx > activeIndex ? 'next' : 'prev');
    setActiveIndex(idx);
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    if (hasPrev) goTo(activeIndex - 1);
  }, [hasPrev, activeIndex, goTo]);

  const handleNext = useCallback(() => {
    if (hasNext) goTo(activeIndex + 1);
  }, [hasNext, activeIndex, goTo]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    touchOnInteractive.current = !!e.target.closest('button, a, input, select, textarea');
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchOnInteractive.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold && hasNext) {
      handleNext();
    } else if (diff < -threshold && hasPrev) {
      handlePrev();
    }
  }, [hasNext, hasPrev, handleNext, handlePrev]);

  const handleImgTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      modalLastTouchDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      modalLastTouchX.current = e.touches[0].clientX;
      modalLastTouchY.current = e.touches[0].clientY;
    }
    modalTouching.current = true;
  }, []);

  const handleImgTouchMove = useCallback((e) => {
    if (!modalTouching.current) return;
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = dist - modalLastTouchDist.current;
      modalLastTouchDist.current = dist;
      modalScale.current = Math.max(0.5, Math.min(5, modalScale.current + delta * 0.01));
      setModalTransform(`scale(${modalScale.current})`);
    } else if (e.touches.length === 1 && modalScale.current > 1) {
      const px = e.touches[0].clientX - modalLastTouchX.current;
      const py = e.touches[0].clientY - modalLastTouchY.current;
      modalLastTouchX.current = e.touches[0].clientX;
      modalLastTouchY.current = e.touches[0].clientY;
      modalTranslateX.current += px;
      modalTranslateY.current += py;
      setModalTransform(`translate(${modalTranslateX.current}px, ${modalTranslateY.current}px) scale(${modalScale.current})`);
    }
  }, []);

  const handleImgTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      modalTouching.current = false;
      if (modalScale.current <= 1) {
        modalScale.current = 1;
        modalTranslateX.current = 0;
        modalTranslateY.current = 0;
        setModalTransform('none');
      }
    }
  }, []);

  const handleModalBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) closeModal();
  }, [closeModal]);

  const handleAddToCart = (e) => {
    navigator.vibrate?.([20, 30, 20]);
    addFlyItem(e.currentTarget);
    addToCart({
      ...currentDesign,
      catalogName,
    });
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (!currentDesign) return;
    toggleWishlist({
      _id: currentDesign._id,
      catalogName: catalogName || currentDesign.catalogName,
      sku: currentDesign.sku,
      weight: currentDesign.weight,
      imageUrl: currentDesign.imageUrl,
    });
  };

  // Build image URL for SEO
  const seoImageUrl = currentDesign?.imageUrl?.startsWith('http')
    ? currentDesign.imageUrl
    : currentDesign?.imageUrl
      ? `https://apis.27012610.xyz${currentDesign.imageUrl}`
      : 'https://pmjewellers.com/logo.png';

  return (
    <>
      <SEO 
        title={currentDesign ? `${catalogName} — ${currentDesign.sku}` : 'Silver Jewellery Design'}
        description={currentDesign 
          ? `Handcrafted ${catalogName} silver jewellery design (${currentDesign.sku}, ${currentDesign.weight}g). Premium wholesale silver from PM Jewellers, Ahmedabad. Buy silver jewellery online — antique, bridal, designer.`
          : 'Explore premium silver jewellery designs from PM Jewellers, Ahmedabad. Wholesale silver — juda, payal, bangles, rings, earrings, necklace.'
        }
        keywords={`${catalogName}, ${currentDesign?.sku}, silver jewellery, ${currentDesign?.weight}g, PM Jewellers, Ahmedabad, Gujarat, wholesale silver, buy silver jewellery online, antique silver, bridal silver, designer silver`}
        image={seoImageUrl}
        url={currentDesign ? `/design/${currentDesign._id}` : `/design/${id}`}
        type="product"
        breadcrumbs={catalogIdFromDesign ? [
          { name: 'Home', url: '/' },
          { name: 'Catalogues', url: '/listing' },
          { name: catalogName, url: `/catalog/${catalogIdFromDesign}` },
          { name: currentDesign?.sku || 'Design', url: `/design/${currentDesign?._id}` }
        ] : [
          { name: 'Home', url: '/' },
          { name: currentDesign?.sku || 'Design', url: `/design/${id}` }
        ]}
        jsonLd={currentDesign ? createProductSchema({
          _id: currentDesign._id,
          name: `${catalogName} — ${currentDesign.sku}`,
          description: `Handcrafted ${catalogName} silver jewellery design (${currentDesign.sku}, ${currentDesign.weight}g). Wholesale silver jewellery from PM Jewellers, Ahmedabad.`,
          images: currentDesign.imageUrl ? [currentDesign.imageUrl] : [],
          sku: currentDesign.sku,
          weight: currentDesign.weight,
          category: catalogName
        }) : null}
      />
      <style>{styles}</style>
      <div className="design-root">

        {/* ── GRADIENT HEADER ── */}
        <div className="header-block">
          <div className="header-inner">
            <button className="back-btn" onClick={() => window.history.back()} aria-label="Go back">
              <span className="back-glyph">←</span>
            </button>
            <div className="header-titles">
              <p className="header-eyebrow">Design {designs.length > 0 ? activeIndex + 1 : ''}</p>
              <h1 className="header-title">{catalogName}</h1>
              {designs.length > 1 && (
                <div className="counter-row">
                  <span className="counter-text">{activeIndex + 1} / {designs.length}</span>
                </div>
              )}
            </div>
            <Link to="/cart" className="header-cart-btn" ref={cartRef}>
              <span>🛍</span>
              <span className="header-cart-label">My Order</span>
            </Link>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="centered-state">
            <div className="loader-wrap">
              <span className="loader-dot" />
              <span className="loader-dot" />
              <span className="loader-dot" />
            </div>
          </div>
        )}

        {/* NOT FOUND */}
        {!loading && !currentDesign && (
          <div className="centered-state">
            <p className="error-text">Design not found</p>
            <button className="back-btn" onClick={() => window.history.back()}>
              <span className="back-glyph">← Back</span>
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!loading && currentDesign && (
          <>
          <div className="page-body">
            <div
              className="swipe-area"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Image */}
              <div className={`image-wrap ${slideDir === 'next' ? 'slide-next' : 'slide-prev'}`} key={currentDesign._id}>
                {currentDesign.imageUrl ? (
                  <img
                    className="design-image"
                    src={
                      currentDesign.imageUrl?.startsWith('http')
                        ? currentDesign.imageUrl
                        : `https://apis.27012610.xyz${currentDesign.imageUrl}`
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://placehold.co/1000x1000/F7F6F3/C8C8C4?text=No+Image';
                    }}
                    alt={`Premium ${catalogName} silver ${currentDesign.sku} ${currentDesign.weight}g design, handcrafted antique jewellery from PM Jewellers`}
                    width={600}
                    height={600}
                    loading="eager"
                    fetchPriority="high"
                    onClick={() => openModal(
                      currentDesign.imageUrl?.startsWith('http')
                        ? currentDesign.imageUrl
                        : `https://apis.27012610.xyz${currentDesign.imageUrl}`
                    )}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <span style={{fontSize: '3rem', color: '#C8C8C4'}}>◇</span>
                )}
                <button
                  className={`wishlist-btn ${hasWishlist(currentDesign._id) ? 'active' : 'inactive'}`}
                  onClick={handleToggleWishlist}
                  aria-label={hasWishlist(currentDesign._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {hasWishlist(currentDesign._id) ? '♥' : '♡'}
                </button>

                {/* Nav arrows */}
                {hasPrev && (
                  <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous design">‹</button>
                )}
                {hasNext && (
                  <button className="nav-arrow next" onClick={handleNext} aria-label="Next design">›</button>
                )}
              </div>

              {/* Info */}
              <div className="info-card">
                <div className="specs-grid">
                  <div className="spec-cell">
                    <p className="spec-label">Tag</p>
                    <p className="spec-value">{currentDesign.sku}</p>
                  </div>
                  <div className="spec-cell">
                    <p className="spec-label">Weight</p>
                    <p className="spec-value">{currentDesign.weight}g</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="actions-card">
                <button className="btn-cart" onClick={handleAddToCart}>
                  Add to My Order
                </button>
              </div>

              {/* Product Content */}
              {(() => {
                const content = generateProductContent(catalogName, currentDesign);
                return (
                  <div className="product-content">
                    <h1>{catalogName} — Silver {content.type}</h1>
                    <p className="product-description">{content.description}</p>
                    <p className="product-section-title">Features</p>
                    <ul className="product-features">
                      {content.features.map((f, i) => (
                        <li key={i}><span className="feature-icon">◆</span> {f}</li>
                      ))}
                    </ul>
                    <p className="product-section-title">Specifications</p>
                    <div className="specs-grid" style={{ marginBottom: 16 }}>
                      <div className="spec-cell">
                        <p className="spec-label">Material</p>
                        <p className="spec-value">Pure Silver</p>
                      </div>
                      <div className="spec-cell">
                        <p className="spec-label">Type</p>
                        <p className="spec-value">{content.type}</p>
                      </div>
                      <div className="spec-cell">
                        <p className="spec-label">Weight</p>
                        <p className="spec-value">{weight}g</p>
                      </div>
                      <div className="spec-cell">
                        <p className="spec-label">SKU</p>
                        <p className="spec-value">{sku}</p>
                      </div>
                    </div>
                    <p className="product-section-title">Usage</p>
                    <p className="care-text" style={{ marginBottom: 16 }}>{content.usage}</p>
                    <p className="product-section-title">Care Instructions</p>
                    <p className="care-text">{content.care}</p>

                    {/* Related Designs */}
                    {designs.length > 1 && (
                      <div className="related-section">
                        <p className="product-section-title">{getRelatedDesignsText(catalogName)}</p>
                        <div className="related-grid">
                          {designs
                            .filter((d) => d._id !== currentDesign._id)
                            .slice(0, 6)
                            .map((d) => {
                              const imgSrc = d.imageUrl?.startsWith('http')
                                ? d.imageUrl
                                : d.imageUrl
                                  ? `https://apis.27012610.xyz${d.imageUrl}`
                                  : '';
                              return (
                                <div
                                  key={d._id}
                                  className="related-card"
                                  onClick={() => {
                                    const idx = designs.findIndex((x) => x._id === d._id);
                                    if (idx !== -1) goTo(idx);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                >
                                  {imgSrc ? (
                                    <img className="related-img" src={imgSrc} alt={d.sku || 'Design'} loading="lazy" />
                                  ) : (
                                    <div className="related-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0EB' }}>
                                      <span style={{ color: '#C8C8C4', fontSize: '1.5rem' }}>◇</span>
                                    </div>
                                  )}
                                  <p className="related-label">{d.sku}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
          </>
        )}

        {/* FLYING ITEMS */}
        {flyItems.map((f) => (
          <div
            key={f.id}
            className="fly-dot"
            style={{
              '--from-x': `${f.fromX}px`,
              '--from-y': `${f.fromY}px`,
              '--to-x': `${f.toX}px`,
              '--to-y': `${f.toY}px`,
            }}
          />
        ))}

        {/* TOAST */}
        {toast && <div className="toast">✓ Added to My Order</div>}

        {/* ── IMAGE ZOOM MODAL ── */}
        {modalImageUrl && (
          <div className="zoom-overlay" onClick={handleModalBackdropClick}>
            <button className="zoom-close" onClick={closeModal} aria-label="Close zoom">✕</button>
            <img
              className="zoom-image"
              src={modalImageUrl}
              alt={`Full size ${catalogName} ${currentDesign.sku} ${currentDesign.weight}g silver jewellery design`}
              draggable={false}
              width={1200}
              height={1200}
              style={{ transform: modalTransform }}
              onTouchStart={handleImgTouchStart}
              onTouchMove={handleImgTouchMove}
              onTouchEnd={handleImgTouchEnd}
            />
          </div>
        )}

        {/* PRELOAD adjacent images (3 each direction) */}
        {designs.length > 1 && (
          <div style={{ display: 'none' }} aria-hidden="true">
            {[-3, -2, -1, 1, 2, 3].map((offset) => {
              const idx = activeIndex + offset;
              const d = designs[idx];
              if (!d?.imageUrl) return null;
              const src = d.imageUrl.startsWith('http') ? d.imageUrl : `https://apis.27012610.xyz${d.imageUrl}`;
              return <img key={d._id} src={src} alt="" />;
            })}
          </div>
        )}

      </div>
    </>
  );
}
