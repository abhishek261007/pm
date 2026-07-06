import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

function srcOf(img) {
  if (!img) return '';
  return typeof img === 'string' ? img : img.src || '';
}

export default function GlassBall({
  images,
  cardCount = 24,
  coverage = 0.62,
  cardScale = 0.4,
  cardRatio = 0.8,
  cardRadius = 12,
  cardOpacity = 0.78,
  depthFade = true,
  rotateSpeed = 0.06,
  tilt = 12,
  enableDrag = true,
  backgroundColor = '#0f1620',
  showGrid = false,
  gridColor = 'rgba(255,255,255,0.05)',
  style,
}) {
  const rootRef = useRef(null);
  const sphereRef = useRef(null);
  const cardRefs = useRef([]);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [box, setBox] = useState({ w: 600, h: 600 });
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const short = Math.min(box.w, box.h);
  const radius = Math.max(40, short * coverage / 2);
  const cardH = Math.max(18, radius * cardScale);
  const cardW = Math.max(14, cardH * cardRatio);
  const perspective = Math.max(700, short * 1.5);

  const list = images && images.length ? images : [''];
  const count = Math.max(1, Math.min(cardCount, 60));

  const cards = useRef([]);
  cards.current = Array.from({ length: count }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const rotY = Math.atan2(x, z) * (180 / Math.PI);
    const rotX = Math.asin(-y / radius) * (180 / Math.PI);
    return {
      src: srcOf(list[i % list.length]),
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
      z,
    };
  });

  const rot = useRef({ rx: tilt, ry: 0, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0 });

  const applyDepth = () => {
    if (!depthFade) return;
    const s = rot.current;
    const ryRad = (s.ry * Math.PI) / 180;
    for (let i = 0; i < count; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const z0 = cards.current[i]?.z ?? 0;
      const worldZ = z0 * Math.cos(ryRad);
      const t = (worldZ + radius) / (2 * radius);
      el.style.opacity = String(cardOpacity * (0.35 + 0.65 * t));
    }
  };

  useEffect(() => {
    if (!inView || !sphereRef.current) return;
    const sphere = sphereRef.current;
    let raf = 0;
    let prev = performance.now();

    const tick = (now) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      const s = rot.current;

      if (!s.dragging) {
        s.ry += rotateSpeed * dt;
        s.ry += s.vy;
        s.rx += s.vx;
        s.vy *= 0.94;
        s.vx *= 0.94;
      }
      s.rx = Math.max(-70, Math.min(70, s.rx));
      sphere.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      applyDepth();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, rotateSpeed, tilt, depthFade, radius, count, cardOpacity]);

  const onPointerDown = (e) => {
    if (!enableDrag) return;
    const s = rot.current;
    s.dragging = true;
    s.vx = 0;
    s.vy = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    e.target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = rot.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.ry += dx * 0.3;
    s.rx -= dy * 0.3;
    s.vy = dx * 0.3;
    s.vx = -dy * 0.3;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };

  const onPointerUp = (e) => {
    rot.current.dragging = false;
    e.target.releasePointerCapture?.(e.pointerId);
  };

  const gridBg = showGrid
    ? {
        backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: '56px 56px',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: backgroundColor,
        perspective,
        cursor: enableDrag ? 'grab' : 'default',
        touchAction: enableDrag ? 'none' : 'auto',
        ...gridBg,
        ...style,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        ref={sphereRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {cards.current.map((c, i) => (
          <div
            key={i}
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: cardW,
              height: cardH,
              margin: `${-cardH / 2}px 0 0 ${-cardW / 2}px`,
              borderRadius: cardRadius,
              overflow: 'hidden',
              background: 'rgba(28,28,36,0.5)',
              boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
              transform: c.transform,
              backfaceVisibility: 'visible',
              opacity: cardOpacity,
            }}
          >
            {c.src && (
              <img
                src={c.src}
                alt=""
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: 0.9,
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
