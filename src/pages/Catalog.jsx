import { useEffect, useMemo, useState, useCallback, memo, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import useWishlistStore from '../store/wishlistStore';

const API_BASE = 'https://apis.27012610.xyz';

/* ─── Pure helpers ─── */
function buildImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE}${imageUrl}`;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .catalog-root {
    min-height: 100vh;
    background: #F7F6F3;
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    color: #2C1810;
    -webkit-font-smoothing: antialiased;
  }

  /* ── GRADIENT HEADER ── */
  .header-block {
    background: linear-gradient(135deg, #8B1A4A, #1B3A5C, #4A8B7C);
    padding: calc(20px + env(safe-area-inset-top, 40px)) 20px 22px;
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
  .cart-badge {
    position: absolute; top: -4px; right: -4px;
    width: 18px; height: 18px; border-radius: 9px;
    background: #B8860B;
    display: flex; align-items: center; justify-content: center;
  }
  .cart-badge-text {
    font-family: 'Outfit', sans-serif;
    font-size: 8px; color: #FFFFFF;
  }

  /* ── BODY ── */
  .page-body {
    padding: 16px 16px 90px;
  }

  /* ── SEARCH ── */
  .search-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #FFFFFF;
    border-radius: 16px;
    border: 1.5px solid #E8E0D8;
    padding: 11px 14px;
    margin-bottom: 16px;
    box-shadow: 0 3px 6px rgba(15,38,64,0.05);
  }
  .search-row:focus-within { border-color: #8B1A4A; }
  .search-glyph { font-size: 18px; color: #8A7A6B; }
  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #2C1810;
  }
  .search-input::placeholder { color: #8A7A6B; }
  .search-clear {
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #8B1A4A;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
    padding: 2px 4px;
  }

  /* ── FILTERS ── */
  .filter-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }
  .weight-filter {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #FFFFFF;
    border: 1.5px solid #E8E0D8;
    border-radius: 14px;
    padding: 6px 10px;
    flex: 1;
    max-width: 220px;
  }
  .weight-input {
    width: 0;
    flex: 1;
    border: none;
    outline: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #2C1810;
    background: transparent;
    -moz-appearance: textfield;
  }
  .weight-input::-webkit-outer-spin-button,
  .weight-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .weight-input::placeholder { color: #C8C8C4; font-weight: 400; }
  .weight-sep {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #8A7A6B;
    flex-shrink: 0;
  }
  .filter-pill {
    flex-shrink: 0;
    padding: 9px 14px;
    border-radius: 20px;
    border: 1.5px solid #E8E0D8;
    background: #FFFFFF;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #8A7A6B;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .filter-pill.wishlist.active {
    border-color: #C53030;
    background: #C53030;
    color: #FFFFFF;
  }

  /* ── COUNT ── */
  .count-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .count-label {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #8A7A6B;
  }
  .count-num {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #8B1A4A;
  }

  /* ── DESIGNS GRID ── */
  .designs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  /* ── DESIGN CARD ── */
  .design-card {
    background: #FFFFFF;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    display: flex;
    flex-direction: column;
  }
  .card-link { text-decoration: none; display: flex; flex-direction: column; flex: 1; }

  .card-image-wrap {
    aspect-ratio: 1 / 1.1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F0EB;
    overflow: hidden;
  }
  .card-image {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .image-placeholder {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem; color: #C8C8C4;
  }

  .wishlist-btn {
    position: absolute; top: 8px; right: 8px;
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.9); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.1rem; line-height: 1;
    z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  .wishlist-btn.active { color: #C53030; }
  .wishlist-btn.inactive { color: #C8C8C4; }

  .card-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }

  .card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    color: #2C1810;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .card-chips { display: flex; gap: 6px; }
  .chip {
    flex: 1;
    background: #F5F0EB;
    border-radius: 8px;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .chip-label {
    font-family: 'Outfit', sans-serif;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #8A7A6B;
  }
  .chip-value {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #2C1810;
  }

  .btn-add {
    margin-top: auto;
    padding: 10px;
    border: none;
    cursor: pointer;
    background: #2C1810;
    color: #F7F6F3;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 10px;
    transition: opacity 0.2s ease;
  }
  .btn-add:hover { opacity: 0.85; }

  /* ── STATES ── */
  .center-box {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 6rem 2rem; text-align: center;
  }
  .dots-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .dot {
    width: 5px; height: 5px; border-radius: 50%; background: #C8C8C4;
    animation: pulse 1.2s infinite ease-in-out;
  }
  .dot:nth-child(2) { animation-delay: 0.16s; }
  .dot:nth-child(3) { animation-delay: 0.32s; }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; transform: scale(1.1); }
  }
  .loading-text {
    font-family: 'Outfit', sans-serif;
    font-size: 11px; letter-spacing: 2px;
    text-transform: uppercase; color: #C8C8C4;
  }
  .empty-glyph { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 30px; color: #8B1A4A; margin-bottom: 16px; }
  .empty-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; font-weight: 600; color: #2C1810; margin-bottom: 8px; }
  .empty-subtitle { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 300; letter-spacing: 2px; color: #8A7A6B; text-align: center; text-transform: uppercase; }
  .retry-btn {
    margin-top: 24px; padding: 12px 32px; border-radius: 14px;
    background: #8B1A4A; color: #FFFFFF; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
  }
  .retry-btn:hover { opacity: 0.85; }

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
    position: fixed; bottom: 6rem; right: 2rem;
    padding: 0.75rem 1.25rem;
    background: #2C1810; color: #F7F6F3;
    font-family: 'Outfit', sans-serif;
    font-size: 11px; letter-spacing: 1.5px;
    text-transform: uppercase;
    z-index: 1000;
    animation: toastIn 0.3s ease, toastOut 0.3s ease 1.7s forwards;
  }
  @keyframes toastIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }

  /* ── RESPONSIVE ── */
  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; }
    .designs-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  }
  @media (min-width: 1200px) {
    .designs-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
  }
  @media (max-width: 380px) {
    .designs-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── Design Card (Memoized) ─── */
const DesignCard = memo(function DesignCard({ item, catalogId, catalogName, onAddToCart, isWishlisted, onToggleWishlist, onFlyToCart, filterQuery }) {
  const imageUri = buildImageUrl(item.thumbnailUrl || item.imageUrl);

  const handleAddClick = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    onFlyToCart?.(e.currentTarget);
    onAddToCart(item);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(item);
  };

  return (
    <div className="design-card">
      <Link 
        to={`/design/${item._id}?catalog=${catalogId}${filterQuery}`} 
        state={{ catalogName }} 
        className="card-link"
      >
        <div className="card-image-wrap">
          {imageUri ? (
            <img 
              className="card-image" 
              src={imageUri} 
              alt={item.catalogName || 'Design'} 
              loading="lazy"
            />
          ) : (
            <span className="image-placeholder">◇</span>
          )}
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : 'inactive'}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>
        </div>
        <div className="card-body">
          <h3 className="card-title">{item.catalogName}</h3>
          
          <div className="card-chips">
            <div className="chip">
              <span className="chip-label">SKU</span>
              <span className="chip-value">{item.sku}</span>
            </div>
            <div className="chip">
              <span className="chip-label">Wt</span>
              <span className="chip-value">{item.weight}g</span>
            </div>
          </div>

          <button className="btn-add" onClick={handleAddClick}>
            Add to My Order
          </button>
        </div>
      </Link>
    </div>
  );
});

/* ─── Main Component ─── */
export default function CatalogDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [catalogName, setCatalogName] = useState(state?.catalogName || 'Collection');
  
  const { addToCart } = useCart();
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const hasWishlist = useCallback(
    (id) => wishlistItems.some((i) => i._id === id),
    [wishlistItems]
  );

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const weightMin = searchParams.get('minW') || '';
  const weightMax = searchParams.get('maxW') || '';
  const wishlistOnly = searchParams.get('saved') === '1';
  const [toastMsg, setToastMsg] = useState('');

  const setFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === '' || value === false || value === null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const filterQuery = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (weightMin) p.set('minW', weightMin);
    if (weightMax) p.set('maxW', weightMax);
    if (wishlistOnly) p.set('saved', '1');
    const s = p.toString();
    return s ? `&${s}` : '';
  }, [search, weightMin, weightMax, wishlistOnly]);
  const cartRef = useRef(null);
  const [flyItems, setFlyItems] = useState([]);

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

  const fetchDesigns = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/public/designs?catalogId=${id}`);
      const fetchedDesigns = Array.isArray(res.data) ? res.data : [];
      setDesigns(fetchedDesigns.filter((d) => d.status === 'available'));
      
      if (!state?.catalogName && fetchedDesigns.length > 0) {
        setCatalogName(
          fetchedDesigns[0]?.catalogName || 
          fetchedDesigns[0]?.catalog?.name || 
          'Collection'
        );
      }
    } catch (err) {
      console.error('[CatalogDetails] fetchDesigns failed:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDesigns();
  }, [id]);

  /* ── Filtered List ── */
  const filteredDesigns = useMemo(() => {
    let result = designs;

    // Search filter
    const q = search.trim();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      const regexes = tokens.map(
        (t) => new RegExp(`(?:^|[\\s\\-_])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
      );
      result = result.filter((item) => {
        const haystack = `${item.catalogName ?? ''} ${item.sku ?? ''}`;
        return regexes.every((re) => re.test(haystack));
      });
    }

    // Weight filter (custom range)
    const min = parseFloat(weightMin);
    const max = parseFloat(weightMax);
    if (weightMin !== '' && !isNaN(min)) {
      result = result.filter((item) => parseFloat(item.weight) >= min);
    }
    if (weightMax !== '' && !isNaN(max)) {
      result = result.filter((item) => parseFloat(item.weight) <= max);
    }

    // Wishlist filter
    if (wishlistOnly) {
      result = result.filter((item) => hasWishlist(item._id));
    }

    return result;
  }, [search, weightMin, weightMax, wishlistOnly, designs, hasWishlist]);

  /* ── Add to Cart (Stable Callback) ── */
  const handleAddToCart = useCallback((item) => {
    addToCart({
      _id: item._id,
      title: item.catalogName || 'Untitled',
      sku: item.sku,
      weight: item.weight,
      status: item.status,
      imageUrl: item.imageUrl,
      catalogId: id,
      catalogName: catalogName,
    });
    setToastMsg('Added to My Order');
    setTimeout(() => setToastMsg(''), 2000);
  }, [addToCart, id, catalogName]);

  const handleToggleWishlist = useCallback((item) => {
    toggleWishlist({
      _id: item._id,
      catalogName: item.catalogName || catalogName,
      sku: item.sku,
      weight: item.weight,
      imageUrl: item.imageUrl,
    });
  }, [toggleWishlist, catalogName]);

  return (
    <>
      <style>{styles}</style>
      <div className="catalog-root">

        {/* ── GRADIENT HEADER ── */}
        <div className="header-block">
          <div className="header-inner">
            <button className="back-btn" onClick={() => navigate('/listing')} aria-label="Go back">
              <span className="back-glyph">←</span>
            </button>
            <div className="header-titles">
              <p className="header-eyebrow">Collection</p>
              <h1 className="header-title">{catalogName}</h1>
            </div>
            <Link to="/cart" className="header-cart-btn" ref={cartRef}>
              <span>🛍</span>
              <span className="header-cart-label">My Order</span>
            </Link>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* Search */}
          <div className="search-row">
            <span className="search-glyph">⌕</span>
            <input 
              type="text" 
              placeholder="Search by name or SKU" 
              className="search-input"
              value={search}
              onChange={(e) => setFilter('q', e.target.value)}
            />
            {search.length > 0 && (
              <button className="search-clear" onClick={() => setFilter('q', '')}>Clear</button>
            )}
          </div>

          {/* Filters */}
          {!loading && !error && (
            <>
              <div className="filter-row">
                <div className="weight-filter">
                  <input
                    type="number"
                    className="weight-input"
                    placeholder="Min g"
                    value={weightMin}
                    onChange={(e) => setFilter('minW', e.target.value)}
                    min="0"
                    step="0.1"
                  />
                  <span className="weight-sep">–</span>
                  <input
                    type="number"
                    className="weight-input"
                    placeholder="Max g"
                    value={weightMax}
                    onChange={(e) => setFilter('maxW', e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <button className={`filter-pill wishlist ${wishlistOnly ? 'active' : ''}`} onClick={() => setFilter('saved', wishlistOnly ? '' : '1')}>
                  {wishlistOnly ? '♥' : '♡'} Saved
                </button>
              </div>
              <div className="count-row">
                <span className="count-label">DESIGNS</span>
                <span className="count-num">{filteredDesigns.length}</span>
              </div>
            </>
          )}

          {/* Grid Content */}
          {loading ? (
            <div className="center-box">
              <div className="dots-row">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p className="loading-text">Loading designs</p>
            </div>
          ) : error ? (
            <div className="center-box">
              <span className="empty-glyph">◆</span>
              <h2 className="empty-title">Failed to load</h2>
              <p className="empty-subtitle">Check your connection and try again</p>
              <button className="retry-btn" onClick={fetchDesigns}>Retry</button>
            </div>
          ) : (
            <div className="designs-grid">
              {filteredDesigns.length === 0 && (
                <div className="center-box">
                  <span className="empty-glyph">◆</span>
                  <h2 className="empty-title">No designs found</h2>
                  <p className="empty-subtitle">Try a different search term</p>
                </div>
              )}
              
              {filteredDesigns.map((design) => (
                <DesignCard 
                  key={design._id}
                  item={design}
                  catalogId={id}
                  catalogName={catalogName}
                  onAddToCart={handleAddToCart}
                  isWishlisted={hasWishlist(design._id)}
                  onToggleWishlist={handleToggleWishlist}
                  onFlyToCart={addFlyItem}
                  filterQuery={filterQuery}
                />
              ))}
            </div>
          )}

        </div>

        {/* ── FLYING ITEMS ── */}
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

        {/* ── TOAST ── */}
        {toastMsg && <div className="toast">✓ {toastMsg}</div>}

      </div>
    </>
  );
}