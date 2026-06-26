import { Link } from 'react-router-dom';
import useWishlistStore from '../store/wishlistStore';
import TabBar from '../components/TabBar';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .wishlist-root {
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

  /* ── HEADER ROW ── */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .page-header-label {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #8A7A6B;
    text-transform: uppercase;
  }
  .clear-btn {
    background: none;
    border: 1.5px solid #E8E0D8;
    padding: 8px 14px;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .clear-btn:hover { color: #C53030; border-color: #C53030; }

  /* ── GRID ── */
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  /* ── CARD ── */
  .wishlist-card {
    background: #FFFFFF;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    display: flex;
    flex-direction: column;
  }
  .card-link {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
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
  .card-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
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
  .remove-btn {
    margin-top: auto;
    padding: 10px;
    border: none;
    cursor: pointer;
    background: #F5F0EB;
    color: #C53030;
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
  .remove-btn:hover { opacity: 0.7; }

  /* ── EMPTY ── */
  .empty-panel {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 50vh; text-align: center;
    padding: 6rem 2rem;
    gap: 16px;
  }
  .empty-icon {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 3rem; color: #C8C8C4;
  }
  .empty-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 600;
    color: #2C1810;
  }
  .empty-sub {
    font-size: 14px; font-weight: 300;
    color: #8A7A6B;
  }
  .browse-btn {
    display: inline-flex; align-items: center;
    padding: 14px 28px; margin-top: 8px;
    background: #2C1810; color: #F7F6F3;
    text-decoration: none;
    border-radius: 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: opacity 0.2s ease;
  }
  .browse-btn:hover { opacity: 0.85; }

  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; }
    .wishlist-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  }
  @media (min-width: 1200px) {
    .wishlist-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
  }
  @media (max-width: 380px) {
    .wishlist-grid { grid-template-columns: 1fr; }
  }
`;

const API_BASE = 'https://apis.27012610.xyz';

function buildImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE}${imageUrl}`;
}

export default function Wishlist() {
  const { items, remove, clear } = useWishlistStore();

  const confirmClear = () => {
    if (items.length === 0) return;
    if (window.confirm('Remove all favorites?')) {
      clear();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="wishlist-root">

        {/* ── GRADIENT HEADER ── */}
        <div className="header-block">
          <div className="header-inner">
            <div className="header-titles">
              <p className="header-eyebrow">Saved</p>
              <h1 className="header-title">Wishlist</h1>
            </div>
            <Link to="/cart" className="header-cart-btn">
              <span>🛍</span>
              <span className="header-cart-label">My Order</span>
            </Link>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {items.length === 0 ? (
            <div className="empty-panel">
              <span className="empty-icon">♡</span>
              <h2 className="empty-title">No favorites yet</h2>
              <p className="empty-sub">Tap the heart on any design to save it here</p>
              <Link to="/listing" className="browse-btn">Browse Collections →</Link>
            </div>
          ) : (
            <>
              <div className="page-header">
                <span className="page-header-label">{items.length} SAVED</span>
                <button onClick={confirmClear} className="clear-btn">Clear All</button>
              </div>

              <div className="wishlist-grid">
                {items.map((item) => {
                  const imageUri = buildImageUrl(item.thumbnailUrl || item.imageUrl);
                  return (
                    <div key={item._id} className="wishlist-card">
                      <Link
                        to={`/design/${item._id}?catalog=${item._id}`}
                        state={{ catalogName: item.catalogName }}
                        className="card-link"
                      >
                        <div className="card-image-wrap">
                          {imageUri ? (
                            <img className="card-image" src={imageUri} alt={item.catalogName || 'Design'} loading="lazy" />
                          ) : (
                            <span className="image-placeholder">◇</span>
                          )}
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
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              remove(item._id);
                            }}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

        <TabBar />
      </div>
    </>
  );
}