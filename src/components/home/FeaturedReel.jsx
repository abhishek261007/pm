import { useRef, useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { videoUrl, reelPosterUrl } from '../../utils/media';

export default function FeaturedReel({ src, caption }) {
  const [ref, inView] = useInView(0.2);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (inView) videoRef.current?.play().catch(() => {});
  }, [inView]);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }

  return (
    <div ref={ref} className="featured-item" onClick={toggle}>
      <img className="featured-poster" src={reelPosterUrl(src)} alt={caption} loading="lazy" />
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
      <span className="featured-frame" aria-hidden="true" />
      <div className="featured-caption">
        <p className="featured-caption-text">{caption}</p>
      </div>
    </div>
  );
}
