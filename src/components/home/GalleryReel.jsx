import { useRef, useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { videoUrl, reelPosterUrl } from '../../utils/media';

export default function GalleryReel({ src }) {
  const [ref, inView] = useInView(0.3);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  function toggle() {
    if (!playing) {
      setPlaying(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }

  useEffect(() => {
    if (playing) videoRef.current?.play().catch(() => {});
  }, [playing]);

  return (
    <div ref={ref} className={`gallery-item${playing ? ' is-playing' : ''}`} onClick={toggle}>
      <img className="gallery-poster" src={reelPosterUrl(src)} alt="" loading="lazy" />
      {inView && playing && (
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
      <div className="gallery-play" aria-hidden="true">
        <span className="gallery-play-dot">▶</span>
      </div>
    </div>
  );
}
