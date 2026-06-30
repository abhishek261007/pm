import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HERO_REEL } from '../../data/reels';
import { videoUrl, reelPosterUrl } from '../../utils/media';
import HallmarkBadge from './HallmarkBadge';

export default function Hero() {
  const [ready, setReady] = useState(false);

  return (
    <section className="hero">
      <img className="hero-poster" src={reelPosterUrl(HERO_REEL)} alt="" />
      <video
        className={`hero-video${ready ? ' is-ready' : ''}`}
        src={videoUrl(HERO_REEL)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      />
      <div className="hero-scrim" />

      <div className="hero-content">
        <HallmarkBadge label="Est. Manekchowk" />
        <img className="hero-logo" src="/logo.png" alt="PM Jewellers" />
        <p className="hero-title">Silver &amp; Antique Jewellery, Crafted for Trade</p>
        <Link to="/listing" className="hero-cta">
          <span>Explore the Collection</span>
          <span className="hero-cta-arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">Scroll</span>
      </div>
    </section>
  );
}
