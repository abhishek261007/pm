import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HERO_REEL } from '../../data/reels';
import { videoUrl, reelPosterUrl } from '../../utils/media';
import HallmarkBadge from './HallmarkBadge';

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Hero() {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef(null);

  // Parallax: video moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const scrimOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  return (
    <section className="hero" ref={sectionRef}>
      {/* Poster fallback */}
      <motion.img
        className="hero-poster"
        src={reelPosterUrl(HERO_REEL)}
        alt=""
        style={{ y: videoY }}
      />

      {/* Video with parallax */}
      <motion.video
        className={`hero-video${ready ? ' is-ready' : ''}`}
        src={videoUrl(HERO_REEL)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
        style={{ y: videoY }}
      />

      {/* Shimmer overlay */}
      <div className="hero-shimmer" aria-hidden="true" />

      {/* Gradient scrim */}
      <motion.div className="hero-scrim" style={{ opacity: scrimOpacity }} />

      {/* Content with staggered entrance */}
      <motion.div
        className="hero-content"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeSlide}>
          <HallmarkBadge label="Est. Manekchowk" />
        </motion.div>
        <motion.img
          className="hero-logo"
          src="/logo.png"
          alt="PM Jewellers"
          variants={fadeSlide}
        />
        <motion.p className="hero-title" variants={fadeSlide}>
          Silver &amp; Antique Jewellery, Crafted for Trade
        </motion.p>
        <motion.div variants={fadeSlide}>
          <Link to="/listing" className="hero-cta">
            <span>Explore the Collection</span>
            <span className="hero-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="hero-scroll-hint"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="hero-scroll-chevron" />
        <span className="hero-scroll-label">Scroll</span>
      </motion.div>
    </section>
  );
}
