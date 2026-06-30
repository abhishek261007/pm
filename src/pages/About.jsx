import { Link } from 'react-router-dom';
import TabBar from '../components/TabBar';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .about-root {
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
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.9);
  }

  /* ── BODY ── */
  .page-body {
    padding: 16px 16px 90px;
    max-width: 600px;
    margin: 0 auto;
  }

  /* ── CARDS ── */
  .info-card {
    background: #FFFFFF;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    margin-bottom: 16px;
  }
  .card-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 1.4rem;
    font-weight: 200;
    color: #2C1810;
    margin-bottom: 16px;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .info-row {
    display: flex;
    align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid #F5F0EB;
    gap: 12px;
  }
  .info-row:last-child { border-bottom: none; }
  .info-icon { font-size: 18px; width: 28px; flex-shrink: 0; text-align: center; }
  .info-content { flex: 1; }
  .info-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A7A6B;
    margin-bottom: 4px;
  }
  .info-value {
    font-size: 14px;
    font-weight: 400;
    color: #2C1810;
    line-height: 1.5;
  }
  .info-value a { color: #1B3A5C; text-decoration: underline; }

  .story-text {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.8;
    color: #8A7A6B;
    margin-bottom: 12px;
  }
  .story-text:last-child { margin-bottom: 0; }

  @media (min-width: 768px) {
    .page-body { padding: 24px 40px 90px; }
  }
`;

export default function About() {

  return (
    <>
      <style>{styles}</style>
      <div className="about-root">

        {/* ── GRADIENT HEADER ── */}
        <div className="header-block">
          <div className="header-inner">
            <div className="header-titles">
              <p className="header-eyebrow">Visit Us</p>
              <h1 className="header-title">About PM Jewellers</h1>
            </div>
            <Link to="/cart" className="header-cart-btn">
              <span>🛍</span>
              <span className="header-cart-label">My Order</span>
            </Link>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* Store Info */}
          <div className="info-card">
            <h2 className="card-title">Store Info</h2>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-icon">📍</span>
                <div className="info-content">
                  <p className="info-label">Address</p>
                  <p className="info-value">
                    Chandidham Complex, 1204/F2, MGH Road<br />
                    Old City, Manekchowk, Ahmedabad — 380001
                  </p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">📞</span>
                <div className="info-content">
                  <p className="info-label">Shop Phone</p>
                  <p className="info-value">
                    <a href="tel:+919712779146">097127 79146</a>
                  </p>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">☎️</span>
                <div className="info-content">
                  <p className="info-label">Office Phone</p>
                  <p className="info-value">
                    <a href="tel:+919662279707">96622 79707</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="info-card">
            <h2 className="card-title">Our Story</h2>
            <p className="story-text">
              Established in 2005, PM Jewellers is a trusted wholesaler of
              pure silver jewellery, antique articles, and a wide range of
              silver collections — supplying retailers across India for almost
              two decades.
            </p>
            <p className="story-text">
              Run by Bhavik Jain, our business is built on craftsmanship,
              consistency, and long-term trust with our retail partners.
            </p>
          </div>

          {/* Shipping */}
          <div className="info-card">
            <h2 className="card-title">Shipping</h2>
            <p className="story-text">
              We ship pan-India to wholesalers and retailers nationwide.
            </p>
          </div>

        </div>

        <TabBar />
      </div>
    </>
  );
}