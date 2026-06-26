import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import useWishlistStore from '../store/wishlistStore';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .design-root {
    min-height: 100dvh;
    background: #F7F6F3;
    font-family: 'Outfit', sans-serif;
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
    font-family: 'Outfit', sans-serif;
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
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.85);
    margin-bottom: 2px;
  }
  .header-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 28px;
    font-weight: 600;
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
    font-family: 'Outfit', sans-serif;
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
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
  }

  /* ── PAGE BODY ── */
  .page-body {
    padding: 12px;
    max-width: 600px;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* ── SWIPE AREA ── */
  .swipe-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* ── IMAGE ── */
  .image-wrap {
    background: #FFFFFF;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    margin-bottom: 8px;
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
    background: #FFFFFF;
    border-radius: 16px;
    padding: 12px;
    margin-bottom: 8px;
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
    font-family: 'Outfit', sans-serif;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 4px;
  }
  .spec-value {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 600;
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
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 14px;
    transition: opacity 0.2s ease;
  }
  .btn-cart:hover { opacity: 0.85; }

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
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem; font-weight: 300; font-style: italic;
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
    font-family: 'Outfit', sans-serif;
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

export default function Design() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const catalogId = searchParams.get('catalog');
  const { state } = useLocation();
  const { addToCart } = useCart();

  const [design, setDesign] = useState(null);
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

  const fetchDesigns = async () => {
    if (!catalogId) return;
    try {
      const res = await api.get(`/public/designs?catalogId=${catalogId}`);
      const all = Array.isArray(res.data) ? res.data : [];
      const available = all.filter((d) => d.status === 'available');

      // Apply forwarded filter from catalog
      const fq = searchParams.get('q') || '';
      const fMin = searchParams.get('minW') || '';
      const fMax = searchParams.get('maxW') || '';
      let filtered = available;
      if (fq) {
        const tokens = fq.split(/\s+/).filter(Boolean);
        const regexes = tokens.map(
          (t) => new RegExp(`(?:^|[\\s\\-_])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
        );
        filtered = filtered.filter((item) => {
          const haystack = `${item.catalogName ?? ''} ${item.sku ?? ''}`;
          return regexes.every((re) => re.test(haystack));
        });
      }
      const min = parseFloat(fMin);
      const max = parseFloat(fMax);
      if (fMin !== '' && !isNaN(min)) {
        filtered = filtered.filter((item) => parseFloat(item.weight) >= min);
      }
      if (fMax !== '' && !isNaN(max)) {
        filtered = filtered.filter((item) => parseFloat(item.weight) <= max);
      }

      setDesigns(filtered);
      const idx = filtered.findIndex((d) => d._id === id);
      if (idx !== -1) setActiveIndex(idx);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDesign();
    if (catalogId) fetchDesigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, catalogId, searchParams]);

  const currentDesign = designs.length > 0 ? designs[activeIndex] : design;
  const catalogName = resolveCatalogName(state?.catalogName, currentDesign);
  const hasPrev = activeIndex > 0;
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

  return (
    <>
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
                    alt={currentDesign.title || 'Design'}
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
            </div>
          </div>
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
              alt="Zoom"
              draggable={false}
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
