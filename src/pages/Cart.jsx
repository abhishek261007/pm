import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cart-root {
    min-height: 100vh;
    background: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
  .header-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 28px;
    font-weight: 200;
    color: #FFFFFF;
    letter-spacing: -0.5px;
    line-height: 30px;
    margin-top: 8px;
  }

  /* ── BODY ── */
  .page-body {
    padding: 16px 16px 90px;
  }

  /* ── HEADER ROW ── */
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .cart-header-left {}
  .cart-header-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #8A7A6B;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .cart-header-count {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.8rem;
    font-weight: 200;
    color: #2C1810;
    line-height: 1;
  }
  .clear-btn {
    background: none;
    border: 1.5px solid #E8E0D8;
    padding: 10px 16px;
    border-radius: 12px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .clear-btn:hover { color: #C53030; border-color: #C53030; }

  /* ── ITEMS ── */
  .items-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  .cart-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
  }
  .item-img {
    width: 80px; height: 80px;
    border-radius: 12px;
    object-fit: contain;
    background: #F5F0EB;
    flex-shrink: 0;
  }
  .item-info { flex: 1; min-width: 0; }
  .item-collection {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 4px;
  }
  .item-sku {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.2rem;
    font-weight: 200;
    color: #2C1810;
    line-height: 1.1;
    margin-bottom: 6px;
  }
  .item-meta {
    display: flex;
    gap: 8px;
  }
  .meta-pill {
    background: #F5F0EB;
    border-radius: 8px;
    padding: 4px 10px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #2C1810;
  }
  .remove-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1.5px solid #E8E0D8;
    background: transparent;
    color: #C8C8C4;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  .remove-btn:hover { border-color: #C53030; color: #C53030; }

  /* ── SUMMARY ── */
  .summary-card {
    background: #FFFFFF;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    margin-bottom: 16px;
  }
  .summary-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.4rem;
    font-weight: 200;
    color: #2C1810;
    margin-bottom: 16px;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
  }
  .summary-cell {
    background: #F5F0EB;
    border-radius: 12px;
    padding: 14px;
    text-align: center;
  }
  .summary-cell-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 6px;
  }
  .summary-cell-value {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.4rem;
    font-weight: 200;
    color: #2C1810;
    line-height: 1;
  }

  /* ── FORM ── */
  .inquiry-form { display: flex; flex-direction: column; gap: 10px; }
  .input-field {
    width: 100%;
    height: 52px;
    border: 1.5px solid #E8E0D8;
    background: #FFFFFF;
    border-radius: 14px;
    padding: 0 16px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #2C1810;
    outline: none;
    transition: border-color 0.2s ease;
  }
  .input-field:focus { border-color: #8B1A4A; }
  .input-field::placeholder { color: #8A7A6B; }

  .wa-cta {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%; height: 56px;
    background: #2C1810;
    color: #F7F6F3;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  .wa-cta:hover { opacity: 0.85; }
  .wa-cta:disabled { background: #C8C8C4; cursor: not-allowed; }

  /* ── EMPTY ── */
  .empty-panel {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 50vh; text-align: center;
    padding: 6rem 2rem;
    gap: 16px;
  }
  .empty-icon {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 3rem; font-weight: 200; color: #C8C8C4;
  }
  .empty-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 2rem;
    font-weight: 200;
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
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: opacity 0.2s ease;
  }
  .browse-btn:hover { opacity: 0.85; }

  /* ── RESPONSIVE ── */
  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; max-width: 600px; margin: 0 auto; }
  }
`;

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalWeight = cart.reduce(
    (acc, item) => acc + Number(item.weight || 0), 0
  );

  const grouped = cart.reduce((acc, item) => {
    const catalog = item.catalogName || 'General';
    if (!acc[catalog]) acc[catalog] = [];
    acc[catalog].push(item);
    return acc;
  }, {});

  const confirmClear = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      if(clearCart) clearCart();
    }
  };

  const handleWhatsAppInquiry = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!customerPhone.trim()) {
      alert('Please enter your phone number.');
      return;
    }

    if (cart.length === 0) {
      alert('Add some designs before sending an inquiry.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://apis.27012610.xyz/inquiries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: cart.map((item) => ({
            designId: item._id,
            sku: item.sku,
            catalogName: item.catalogName,
            imageUrl: item.imageUrl,
          })),
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error('Failed to save inquiry to database.');

      const sections = Object.entries(grouped).map(([catalogName, designs]) => {
        const skus = designs.map((item, i) => `${i + 1}. Tags: ${item.sku}`);
        return `*Collection: ${catalogName}*\n${skus.join('\n')}`;
      });

      const message = 
        `Hello PM Jewellers!\n\n` +
        `Name: ${customerName}\n` +
        `Phone: ${customerPhone}\n` +
        `Inquiry ID: ${data.inquiry._id}\n\n` +
        `${sections.join('\n\n')}`;

      // Open WhatsApp in a new tab
      window.open(
        `https://wa.me/919712779146?text=${encodeURIComponent(message)}`,
        '_blank'
      );

      // Clear Cart after successful handoff
      if (clearCart) clearCart();

    } catch (err) {
      console.error(err);
      alert('Error: Failed to create inquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cart-root">

        {/* ── GRADIENT HEADER ── */}
        <div className="header-block">
          <div className="header-inner">
            <Link to="/" className="back-btn" aria-label="Go back">
              <span className="back-glyph">←</span>
            </Link>
            <div className="header-title">My Order</div>
            <div style={{width: 44}} />
          </div>
        </div>

        {/* BODY */}
        <div className="page-body">

          {/* HEADER ROW */}
          {cart.length > 0 && (
            <div className="cart-header">
              <div className="cart-header-left">
                <p className="cart-header-label">YOUR SELECTION</p>
                <p className="cart-header-count">{cart.length} piece{cart.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={confirmClear} className="clear-btn">
                Clear All
              </button>
            </div>
          )}

          {/* EMPTY */}
          {cart.length === 0 ? (
            <div className="empty-panel">
              <span className="empty-icon">◇</span>
              <h2 className="empty-title">My Order is empty</h2>
              <p className="empty-sub">Add pieces from our collections to get started</p>
              <Link to="/" className="browse-btn">Browse Collections →</Link>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              <div className="items-wrap">
                {cart.map((item, i) => (
                  <div key={`${item._id}-${item.sku}`} className="cart-item">
                    <img
                      className="item-img"
                      src={
                        item.imageUrl?.startsWith('http')
                          ? item.imageUrl
                          : `https://apis.27012610.xyz${item.imageUrl}`
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://placehold.co/500x500/F7F6F3/C8C8C4?text=No+Image';
                      }}
                      alt={item.title || 'Design'}
                    />
                    <div className="item-info">
                      <p className="item-collection">{item.catalogName || 'Collection'}</p>
                      <p className="item-sku">{item.sku}</p>
                      <div className="item-meta">
                        <span className="meta-pill">#{i + 1}</span>
                        <span className="meta-pill">{item.weight}g</span>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-grid">
                  <div className="summary-cell">
                    <p className="summary-cell-label">Items</p>
                    <p className="summary-cell-value">{cart.length}</p>
                  </div>
                  <div className="summary-cell">
                    <p className="summary-cell-label">Collections</p>
                    <p className="summary-cell-value">{Object.keys(grouped).length}</p>
                  </div>
                  <div className="summary-cell">
                    <p className="summary-cell-label">Weight</p>
                    <p className="summary-cell-value">{totalWeight.toFixed(1)}g</p>
                  </div>
                </div>

                <form className="inquiry-form" onSubmit={handleWhatsAppInquiry}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                  
                  <button 
                    type="submit" 
                    className="wa-cta"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : '✦ Send Inquiry on WhatsApp'}
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}