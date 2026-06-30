import { useRef, useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { videoUrl, reelPosterUrl } from '../../utils/media';

export default function GalleryReel({ src }) {
  const [ref, inView] = useInView(0.3);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (inView) videoRef.current?.play().catch(() => {});
  }, [inView]);

  return (
    <div ref={ref} className="gallery-item">
      <img className="gallery-poster" src={reelPosterUrl(src)} alt="" loading="lazy" />
      {inView && (
        <video
          ref={videoRef}
          className={ready ? 'is-ready' : ''}
          src={videoUrl(src)}
          muted
          playsInline
          loop
          preload="auto"
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
