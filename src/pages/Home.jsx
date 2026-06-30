import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TabBar from '../components/TabBar';

const REELS_BASE = 'https://apis.27012610.xyz/uploads';

const REELS = [
  'PM ORNA DEC REEL 1.mp4',
  'PM ORNA DEC REEL 2.mp4',
  'PM ORNA FEB REEL 1.mp4',
  'PM ORNA FEB REEL 2.mp4',
  'PM ORNA FEB REEL 3.mp4',
  'PM ORNA FEB REEL 4.mp4',
  'PM ORNA FEB REEL 5.mp4',
  'PM ORNA FEB REEL 6.mp4',
  'PM ORNA FEB REEL 7.mp4',
  'PM ORNA FEB REEL 7.1.mp4',
];

const PDFS = Array.from({ length: 18 }, (_, i) => {
  const n = i + 1;
  return n === 1 ? 'PM design1.pdf' : `pm design${n}.pdf`;
});

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
    min-height: 100dvh;
    background: #F7F6F3;
    padding: 24px 0 80px;
  }

  .home-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 24px 32px;
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
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
    margin-top: 8px;
  }
  .home-social a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  .home-social a:active { opacity: 0.6; }

  /* ── SECTION HEADER ── */
  .section-header {
    padding: 28px 20px 12px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #D4AF37;
    margin-bottom: 4px;
  }
  .section-title {
    font-size: 22px;
    font-weight: 200;
    color: #2C1810;
    letter-spacing: -0.3px;
  }

  /* ── REELS HORIZONTAL SCROLL ── */
  .reels-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 20px 4px;
    scrollbar-width: none;
  }
  .reels-scroll::-webkit-scrollbar { display: none; }

  .reel-card {
    flex: 0 0 200px;
    scroll-snap-align: start;
    border-radius: 16px;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    aspect-ratio: 9 / 16;
    position: relative;
    cursor: pointer;
  }
  .reel-card video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }
  .reel-play-indicator {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  .reel-card:hover .reel-play-indicator,
  .reel-card.paused .reel-play-indicator {
    opacity: 1;
  }

  /* ── PDFS GRID ── */
  .pdfs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    padding: 0 20px 20px;
  }
  .pdf-card {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 20px 14px;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .pdf-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15,38,64,0.1);
  }
  .pdf-card:active { transform: scale(0.96); }
  .pdf-icon {
    width: 40px;
    height: 48px;
    background: #C53030;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .pdf-name {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #2C1810;
    line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
`;

function ReelCard({ src }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }, [inView]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  }

  return (
    <div
      ref={cardRef}
      className={`reel-card${paused ? ' paused' : ''}`}
      onClick={toggle}
    >
      <video
        ref={videoRef}
        src={`${REELS_BASE}/reels/${encodeURIComponent(src)}`}
        muted
        playsInline
        loop
        preload="metadata"
      />
      <div className="reel-play-indicator">
        {paused ? '▶' : '❚❚'}
      </div>
    </div>
  );
}

function PdfCard({ src }) {
  const label = src.replace(/\.pdf$/i, '').replace(/^PM\s*/i, '').replace(/^pm\s*/i, '');
  return (
    <a
      href={`${REELS_BASE}/reels/${encodeURIComponent(src)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="pdf-card"
    >
      <div className="pdf-icon">PDF</div>
      <span className="pdf-name">{label}</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="home-root">
        <div className="home-hero">
          <img className="home-logo" src="/logo.png" alt="PM Jewellers" />
          <div className="home-divider" />
          <Link to="/listing" className="home-link">View Catalog →</Link>
          <div className="home-social">
            <a href="https://www.instagram.com/2005_pmjewellers/" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://wa.me/919712779146" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            <a href="https://maps.app.goo.gl/ThdbBRQB5zKAmia97" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── REELS ── */}
        <div className="section-header">
          <p className="section-label">Watch</p>
          <h2 className="section-title">Reels</h2>
        </div>
        <div className="reels-scroll">
          {REELS.map(src => (
            <ReelCard key={src} src={src} />
          ))}
        </div>

        {/* ── PDFs ── */}
        <div className="section-header">
          <p className="section-label">Browse</p>
          <h2 className="section-title">Designs</h2>
        </div>
        <div className="pdfs-grid">
          {PDFS.map(src => (
            <PdfCard key={src} src={src} />
          ))}
        </div>
      </div>
      <TabBar />
    </>
  );
}
