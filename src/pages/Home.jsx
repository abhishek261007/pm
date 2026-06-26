import { Link } from 'react-router-dom';
import TabBar from '../components/TabBar';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
    min-height: 100dvh;
    background: #F7F6F3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px 24px 80px;
    gap: 16px;
  }

  .home-logo {
    max-width: 220px;
    width: 100%;
    height: auto;
    display: block;
  }

  .home-divider {
    width: 48px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
  }

  .home-link {
    margin-top: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: #8A7A6B;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .home-link:hover { color: #2C1810; }

  .home-social {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
  }
  .home-social a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  .home-social a:active { opacity: 0.6; }
`;

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="home-root">
        <img className="home-logo" src="/logo.png" alt="PM Jewellers" />
        <div className="home-divider" />
        <Link to="/listing" className="home-link">View Catalog →</Link>
        <div className="home-social">
          <a href="https://www.instagram.com/2005_pmjewellers/" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="https://wa.me/919712779146" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>
          <a href="https://maps.app.goo.gl/ThdbBRQB5zKAmia97" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </a>
        </div>
      </div>
      <TabBar />
    </>
  );
}
