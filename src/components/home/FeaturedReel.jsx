import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useInView as useInViewHook } from '../../hooks/useInView';
import { videoUrl, reelPosterUrl } from '../../utils/media';

export default function FeaturedReel({ src, caption, index = 0 }) {
  const [ref, inView] = useInViewHook(0.2);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);
  const motionRef = useRef(null);
  const isVisible = useInView(motionRef, { once: true, margin: '-40px 0px' });

  useEffect(() => {
    if (inView) videoRef.current?.play().catch(() => {});
  }, [inView]);

  return (
    <motion.div
      ref={motionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.12,
      }}
    >
      <div ref={ref} className={`featured-item${index === 0 ? ' featured-item--hero' : ''}`}>
        <img className="featured-poster" src={reelPosterUrl(src)} alt="" loading="lazy" />
        {inView && (
          <video
            ref={videoRef}
            className={`featured-media${ready ? ' is-ready' : ''}`}
            src={videoUrl(src)}
            muted
            playsInline
            loop
            preload="metadata"
            onCanPlay={() => setReady(true)}
          />
        )}
        {/* Glass caption overlay */}
        {caption && (
          <div className="featured-caption-overlay">
            <span className="featured-caption-text">{caption}</span>
          </div>
        )}
        <span className="featured-frame" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
