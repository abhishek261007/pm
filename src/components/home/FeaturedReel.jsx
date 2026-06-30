import { useRef, useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { videoUrl, reelPosterUrl } from '../../utils/media';

export default function FeaturedReel({ src }) {
  const [ref, inView] = useInView(0.2);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (inView) videoRef.current?.play().catch(() => {});
  }, [inView]);

  return (
    <div ref={ref} className="featured-item">
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
      <span className="featured-frame" aria-hidden="true" />
    </div>
  );
}
