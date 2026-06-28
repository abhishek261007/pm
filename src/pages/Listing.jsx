import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import TabBar from '../components/TabBar';

const API_BASE = 'https://apis.27012610.xyz';

function buildHeroUrl(heroImageUrl, updatedAt) {
  if (!heroImageUrl) return null;
  const cacheBuster = updatedAt ? `v=${encodeURIComponent(updatedAt)}` : `v=${Date.now()}`;
  if (heroImageUrl.startsWith('http')) return `${heroImageUrl}${heroImageUrl.includes('?') ? '&' : '?'}${cacheBuster}`;
  return `${API_BASE}${heroImageUrl}?${cacheBuster}`;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
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
    padding: calc(16px + env(safe-area-inset-top, 36px)) 16px 16px;
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }
  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .header-left { flex-shrink: 1; }
  .header-brand {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: #FFFFFF;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .header-sub {
    font-family: 'Outfit', sans-serif;
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-top: 4px;
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

  /* ── BODY ── */
  .page-body {
    padding: 16px 16px 90px;
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
  .count-pill {
    background: #F5F0EB;
    border-radius: 10px;
    padding: 3px 10px;
  }
  .count-num {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #8B1A4A;
  }

  /* ── GRID ── */
  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  /* ── CARD ── */
  .card-link {
    text-decoration: none;
    display: block;
  }
  .card {
    background: #FFFFFF;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card-link:hover .card {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15,38,64,0.1);
  }
  .card-hero {
    width: 100%;
    aspect-ratio: 1;
    background: #F5F0EB;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .card-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .hero-placeholder {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    color: #C8C8C4;
  }
  .card-body {
    padding: 14px 16px;
  }
  .card-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2C1810;
    line-height: 1.2;
  }

  /* ── STATES ── */
  .center-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    text-align: center;
  }
  .dots-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #C8C8C4;
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
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #C8C8C4;
  }
  .empty-glyph {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 30px;
    color: #8B1A4A;
    margin-bottom: 16px;
  }
  .empty-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24px;
    font-weight: 600;
    color: #2C1810;
    margin-bottom: 8px;
  }
  .empty-subtitle {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 2px;
    color: #8A7A6B;
    text-align: center;
    text-transform: uppercase;
    line-height: 20px;
  }
  .retry-btn {
    margin-top: 24px;
    padding: 12px 32px;
    border-radius: 14px;
    background: #8B1A4A;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: opacity 0.2s ease;
  }
  .retry-btn:hover { opacity: 0.85; }

  /* Footer */
  .footer-strip {
    border-top: 1px solid #E8E0D8;
    background: #FFFFFF;
    padding: 20px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: #2C1810;
  }
  .footer-addr {
    font-family: 'Outfit', sans-serif;
    font-size: 0.65rem;
    font-weight: 300;
    letter-spacing: 0.06em;
    color: #8A7A6B;
    text-align: right;
    line-height: 1.7;
    font-style: normal;
  }

  /* Responsive */
  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; }
    .catalog-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  }
  @media (min-width: 1200px) {
    .catalog-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
  }
  @media (max-width: 380px) {
    .catalog-grid { grid-template-columns: 1fr; }
  }
`;

export default function Listing() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { cart } = useCart();

  const fetchData = useCallback(async () => {
    setError(false);
    try {
      const res = await api.get('/public/catalogs');
      const data = Array.isArray(res.data) ? res.data : [];
      setCatalogs(data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  }, [fetchData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitial();
  }, [loadInitial]);

  const cartCount = cart?.length || 0;

  const handleShare = useCallback((e, catalogId) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/catalog/${catalogId}`;
    if (navigator.share) {
      navigator.share({ title: 'PM Jewellers', url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(catalogId);
        setShowToast(true);
        setTimeout(() => { setCopiedId(null); setShowToast(false); }, 2000);
      });
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="home-root">

        {/* ── GRADIENT HEADER ── */}
        <div className="header-block">
          <div className="header-inner">
            <div className="header-left">
              <div className="header-brand">PM Jewellers</div>
              <div className="header-sub">Silver · Manekchowk</div>
            </div>
            <Link to="/cart" className="header-cart-btn">
              <span style={{fontSize: '28px', lineHeight: 1}}>🛍</span>
              <span className="header-cart-label">My Order</span>
            </Link>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* COUNT */}
          {!loading && !error && (
            <div className="count-row">
              <span className="count-label">COLLECTIONS</span>
              <div className="count-pill">
                <span className="count-num">{catalogs.length}</span>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <div className="center-box">
              <div className="dots-row">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p className="loading-text">Curating collections</p>
            </div>
          ) : error ? (
            <div className="center-box">
              <span className="empty-glyph">◆</span>
              <h2 className="empty-title">Failed to load</h2>
              <p className="empty-subtitle">Pull down to try again</p>
              <button className="retry-btn" onClick={loadInitial}>Retry</button>
            </div>
           ) : catalogs.length === 0 ? (
             <div className="center-box">
              <span className="empty-glyph">◆</span>
              <h2 className="empty-title">No collections yet</h2>
            </div>
          ) : (
            <div className="catalog-grid">
              {catalogs.map((catalog) => {
                const heroUri = buildHeroUrl(catalog.heroImageUrl, catalog.updatedAt);
                
                return (
                  <Link key={catalog._id} to={`/catalog/${catalog._id}`} state={{ catalogName: catalog.name }} className="card-link">
                    <div className="card">
                      <div className="card-hero">
                        {heroUri ? (
                          <img src={heroUri} alt={catalog.name} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/F7F6F3/C8C8C4?text=No+Image'; }} />
                        ) : (
                          <span className="hero-placeholder">◇</span>
                        )}
                      </div>
                      <div className="card-body">
                        <h2 className="card-name">{catalog.name}</h2>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <TabBar />

      </div>
    </>
  );
}