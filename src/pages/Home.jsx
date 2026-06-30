import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TabBar from '../components/TabBar';

const BASE = '/reels';

const HERO_REEL = 'PM ORNA DEC REEL 1.mp4';

const FEATURED = [
  { file: 'PM ORNA DEC REEL 2.mp4', caption: 'Evening Elegance' },
  { file: 'PM ORNA FEB REEL 1.mp4', caption: 'Festive Radiance' },
  { file: 'PM ORNA FEB REEL 2.mp4', caption: 'Heritage Craft' },
  { file: 'PM ORNA FEB REEL 3.mp4', caption: 'Modern Grace' },
];

const GALLERY = [
  'PM ORNA FEB REEL 4.mp4',
  'PM ORNA FEB REEL 5.mp4',
  'PM ORNA FEB REEL 6.mp4',
  'PM ORNA FEB REEL 7.mp4',
  'PM ORNA FEB REEL 7.1.mp4',
];

const PDFS = Array.from({ length: 18 }, (_, i) => {
  const n = i + 1;
  return { id: n, file: n === 1 ? 'PM design1.pdf' : `pm design${n}.pdf`, label: `Design ${n}` };
});

const CATEGORIES = ['Antique', 'Traditional', 'Contemporary', 'Festive', 'Bridal', 'Daily Wear'];
function assignCategory(n) { return CATEGORIES[n % CATEGORIES.length]; }
function assignWeight(n) {
  const w = [25, 40, 35, 50, 30, 45, 55, 28, 38, 42, 48, 32, 52, 36, 44, 60, 22, 58];
  return w[n % w.length];
}

// ── URL helpers ──
// Posters/covers are pre-generated at build time (ffmpeg frame grabs for
function videoUrl(src) { return `${BASE}/${encodeURIComponent(src)}`; }
function reelPosterUrl(src) {
  const stem = src.replace(/\.mp4$/i, '');
  return `${BASE}/${encodeURIComponent(stem)}.webp`;
}
function pdfUrl(file) { return `${BASE}/${encodeURIComponent(file)}`; }
function pdfCoverUrl(file) {
  const stem = file.replace(/\.pdf$/i, '');
  return `${BASE}/${encodeURIComponent(stem)}.webp`;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home-root {
    background: #F5F0EB;
    padding-bottom: 80px;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-poster,
  .hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .hero-poster { z-index: 0; }
  .hero-video { z-index: 1; opacity: 0; transition: opacity 0.5s ease; }
  .hero-video.ready { opacity: 1; }
  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(
      180deg,
      rgba(15,38,64,0.15) 0%,
      rgba(139,26,74,0.4) 40%,
      rgba(27,58,92,0.7) 70%,
      rgba(15,38,64,0.95) 100%
    );
    pointer-events: none;
  }
  .hero-content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 24px;
    gap: 20px;
    transform: translateY(-5%);
  }
  .hero-logo {
    max-width: 200px;
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
  }
  .hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-top: 4px;
  }
  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border: 1px solid rgba(212,175,55,0.6);
    background: rgba(212,175,55,0.1);
    backdrop-filter: blur(8px);
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #D4AF37;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s ease;
    margin-top: 8px;
  }
  .hero-cta:hover {
    background: rgba(212,175,55,0.2);
    border-color: #D4AF37;
    transform: translateY(-1px);
  }
  .hero-cta:active { transform: scale(0.97); }

  .hero-scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    animation: float 2s ease-in-out infinite;
  }
  .hero-scroll-hint span {
    font-family: 'Outfit', sans-serif;
    font-size: 8px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .hero-scroll-line {
    width: 1px;
    height: 24px;
    background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
  }
  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(4px); }
  }

  /* ── SECTION COMMON ── */
  .section {
    padding: 48px 20px 32px;
    max-width: 600px;
    margin: 0 auto;
  }
  .section-eyebrow {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #8B1A4A;
    margin-bottom: 6px;
  }
  .section-heading {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 32px;
    font-weight: 300;
    color: #2C1810;
    letter-spacing: -0.5px;
    line-height: 1.15;
    margin-bottom: 4px;
  }
  .section-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #8A7A6B;
    line-height: 1.6;
    margin-top: 8px;
  }

  /* ── FEATURED REELS (editorial gallery) ── */
  .featured-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 20px;
  }
  .featured-item:first-child { grid-column: 1 / -1; aspect-ratio: 16 / 9; }
  .featured-item:not(:first-child) { aspect-ratio: 9 / 16; }
  .featured-item {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0 2px 12px rgba(15,38,64,0.06);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .featured-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(15,38,64,0.12);
  }
  .featured-item:active { transform: scale(0.97); }

  .featured-poster,
  .featured-media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: #F5F0EB;
  }
  .featured-media { opacity: 0; transition: opacity 0.4s ease; }
  .featured-media.ready { opacity: 1; }

  .featured-border {
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-radius: 16px;
    transition: border-color 0.3s ease;
    pointer-events: none;
    z-index: 2;
  }
  .featured-item:hover .featured-border { border-color: rgba(212,175,55,0.5); }
  .featured-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 40px 14px 14px;
    background: linear-gradient(0deg, rgba(15,38,64,0.7) 0%, transparent 100%);
  }
  .featured-caption-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
    color: #FFFFFF;
    letter-spacing: 0.3px;
  }

  /* ── FULL REEL GALLERY ── */
  .gallery-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 16px 20px 20px;
    scrollbar-width: none;
    max-width: 100vw;
  }
  .gallery-scroll::-webkit-scrollbar { display: none; }

  .gallery-item {
    flex: 0 0 160px;
    scroll-snap-align: start;
    aspect-ratio: 9 / 16;
    border-radius: 14px;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    cursor: pointer;
    position: relative;
    transition: transform 0.2s ease;
  }
  .gallery-item:hover { transform: translateY(-2px); }
  .gallery-poster,
  .gallery-item video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .gallery-item video { pointer-events: none; opacity: 0; transition: opacity 0.4s ease; }
  .gallery-item video.ready { opacity: 1; }

  .gallery-play {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.12);
    opacity: 1;
    transition: opacity 0.2s ease;
  }
  .gallery-item.playing .gallery-play { opacity: 0; }
  .gallery-play-dot {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(212,175,55,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 16px;
    backdrop-filter: blur(4px);
  }

  /* ── CATALOGUES ── */
  .catalogue-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }
  .catalogue-card {
    background: #FFFFFF;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(15,38,64,0.06);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .catalogue-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15,38,64,0.1);
  }
  .catalogue-card:active { transform: scale(0.96); }

  .catalogue-thumb {
    position: relative;
    aspect-ratio: 3 / 4;
    background: linear-gradient(135deg, #8B1A4A, #1B3A5C);
    overflow: hidden;
  }
  .catalogue-thumb-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .catalogue-thumb-shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15,38,64,0.05) 0%, rgba(15,38,64,0.55) 100%);
  }
  .catalogue-thumb-category {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    font-family: 'Outfit', sans-serif;
    font-size: 7px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #D4AF37;
    background: rgba(27,58,92,0.7);
    padding: 2px 8px;
    border-radius: 10px;
    backdrop-filter: blur(4px);
  }
  .catalogue-thumb-id {
    position: absolute;
    bottom: 8px;
    left: 10px;
    z-index: 2;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 16px;
    font-weight: 300;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }
  .catalogue-body {
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .catalogue-title {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #2C1810;
  }
  .catalogue-weight {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 400;
    color: #8A7A6B;
    background: #F5F0EB;
    padding: 2px 8px;
    border-radius: 8px;
  }
`;

/* ── HOOK: lazy mount once a ref scrolls into view ── */
function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── COMPONENTS ── */

function Hero() {
  const [ready, setReady] = useState(false);
  return (
    <section className="hero">
      <img className="hero-poster" src={reelPosterUrl(HERO_REEL)} alt="" />
      <video
        className={`hero-video${ready ? ' ready' : ''}`}
        src={videoUrl(HERO_REEL)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <img className="hero-logo" src="/logo.png" alt="PM Jewellers" />
        <p className="hero-title">Silver &amp; Antique Jewellery</p>
        <Link to="/listing" className="hero-cta">
          Explore Collection
          <span style={{ fontSize: 16, lineHeight: 1 }}>→</span>
        </Link>
      </div>
      <div className="hero-scroll-hint">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

/* Featured reel: poster shown immediately, video fades in once in view + loaded */
function FeaturedReel({ src, caption }) {
  const [ref, inView] = useInView(0.2);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [inView]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  }

  return (
    <div ref={ref} className="featured-item" onClick={toggle}>
      <img className="featured-poster" src={reelPosterUrl(src)} alt={caption} loading="lazy" />
      {inView && (
        <video
          ref={videoRef}
          className={`featured-media${ready ? ' ready' : ''}`}
          src={videoUrl(src)}
          muted
          playsInline
          loop
          preload="metadata"
          onCanPlay={() => setReady(true)}
        />
      )}
      <div className="featured-border" />
      <div className="featured-caption">
        <p className="featured-caption-text">{caption}</p>
      </div>
    </div>
  );
}

/* Gallery reel: poster always shown, video only mounts on tap (data saver) */
function GalleryReel({ src }) {
  const [ref, inView] = useInView(0.3);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  function toggle() {
    if (!playing) { setPlaying(true); return; }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  }

  useEffect(() => {
    if (playing && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [playing]);

  return (
    <div ref={ref} className={`gallery-item${playing ? ' playing' : ''}`} onClick={toggle}>
      <img className="gallery-poster" src={reelPosterUrl(src)} alt="" loading="lazy" />
      {inView && playing && (
        <video
          ref={videoRef}
          className={ready ? 'ready' : ''}
          src={videoUrl(src)}
          muted
          playsInline
          loop
          preload="auto"
          onCanPlay={() => setReady(true)}
        />
      )}
      <div className="gallery-play">
        <div className="gallery-play-dot">▶</div>
      </div>
    </div>
  );
}

function PdfCard({ id, file, label }) {
  const category = assignCategory(id);
  const weight = assignWeight(id);

  return (
    <a href={pdfUrl(file)} target="_blank" rel="noopener noreferrer" className="catalogue-card">
      <div className="catalogue-thumb">
        <img className="catalogue-thumb-img" src={pdfCoverUrl(file)} alt={label} loading="lazy" />
        <div className="catalogue-thumb-shade" />
        <span className="catalogue-thumb-category">{category}</span>
        <span className="catalogue-thumb-id">{label}</span>
      </div>
      <div className="catalogue-body">
        <span className="catalogue-title">{label}</span>
        <span className="catalogue-weight">{weight}g</span>
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="home-root">
        <Hero />

        {/* ── FEATURED REELS ── */}
        <section className="section">
          <p className="section-eyebrow">Curated</p>
          <h2 className="section-heading">Featured Collections</h2>
          <p className="section-desc">
            A handpicked selection of our finest silver and antique designs.
          </p>
          <div className="featured-grid">
            {FEATURED.map(({ file, caption }) => (
              <FeaturedReel key={file} src={file} caption={caption} />
            ))}
          </div>
        </section>

        {/* ── FULL REEL GALLERY ── */}
        <section className="section" style={{ paddingTop: 16, paddingBottom: 8 }}>
          <p className="section-eyebrow">Watch</p>
          <h2 className="section-heading">All Reels</h2>
        </section>
        <div className="gallery-scroll">
          {GALLERY.map(src => (
            <GalleryReel key={src} src={src} />
          ))}
        </div>

        {/* ── CATALOGUES ── */}
        <section className="section">
          <p className="section-eyebrow">Browse</p>
          <h2 className="section-heading">Design Catalogues</h2>
          <p className="section-desc">
            Detailed silver jewellery catalogues with weights, categories, and full specs.
          </p>
          <div className="catalogue-grid">
            {PDFS.map(p => (
              <PdfCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      </div>
      <TabBar />
    </>
  );
}