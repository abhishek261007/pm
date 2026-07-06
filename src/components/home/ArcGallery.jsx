import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function GalleryItem({ item, index, itemsLength, layout, effects3D, appearance, scrollX, containerWidth }) {
  const itemX = index * (layout.itemWidth + layout.spacing);

  const scale = useTransform(
    scrollX,
    [
      itemX - containerWidth,
      itemX - containerWidth / 2,
      itemX,
      itemX + containerWidth / 2,
      itemX + containerWidth,
    ],
    [
      0.6 + effects3D.scaleDepth * effects3D.arcDepth * 0.2,
      0.8 + effects3D.scaleDepth * effects3D.arcDepth * 0.3,
      1,
      0.8 + effects3D.scaleDepth * effects3D.arcDepth * 0.3,
      0.6 + effects3D.scaleDepth * effects3D.arcDepth * 0.2,
    ]
  );

  const y = useTransform(
    scrollX,
    [
      itemX - containerWidth,
      itemX - containerWidth / 2,
      itemX,
      itemX + containerWidth / 2,
      itemX + containerWidth,
    ],
    [
      effects3D.verticalDepth * effects3D.arcDepth * 160,
      effects3D.verticalDepth * effects3D.arcDepth * 80,
      0,
      effects3D.verticalDepth * effects3D.arcDepth * 80,
      effects3D.verticalDepth * effects3D.arcDepth * 160,
    ]
  );

  const rotateY = useTransform(
    scrollX,
    [
      itemX - containerWidth,
      itemX - containerWidth / 2,
      itemX,
      itemX + containerWidth / 2,
      itemX + containerWidth,
    ],
    [
      effects3D.rotationDepth * effects3D.arcDepth * 60,
      effects3D.rotationDepth * effects3D.arcDepth * 35,
      0,
      -effects3D.rotationDepth * effects3D.arcDepth * 35,
      -effects3D.rotationDepth * effects3D.arcDepth * 60,
    ]
  );

  const imgSrc = item.image?.src || '';
  const imgAlt = item.image?.alt || '';
  const href = item.href;

  const isCenterSet = index >= itemsLength && index < itemsLength * 2;

  return (
    <motion.div
      key={`${index % itemsLength}-${Math.floor(index / itemsLength)}`}
      style={{
        width: layout.itemWidth,
        height: layout.itemHeight,
        flexShrink: 0,
        scale,
        y,
        rotateY,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: appearance.showShadow ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none',
              backgroundColor: '#16202c',
              display: 'flex',
              flexDirection: 'column',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
            }}
          >
            <img
              src={imgSrc}
              alt={imgAlt}
              loading="lazy"
              decoding="async"
              fetchpriority={isCenterSet ? 'high' : 'low'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: layout.imageFit,
                display: 'block',
              }}
            />
          </div>
        </a>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: appearance.showShadow ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none',
            backgroundColor: '#16202c',
            display: 'flex',
            flexDirection: 'column',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={imgSrc}
            alt={imgAlt}
            loading="lazy"
            decoding="async"
            fetchpriority={isCenterSet ? 'high' : 'low'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.imageFit,
              display: 'block',
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function ArcGallery({
  items = [],
  layout = { itemWidth: 176, itemHeight: 312, spacing: 30, imageFit: 'cover' },
  effects3D = { arcDepth: 0.5, scaleDepth: 0.3, verticalDepth: 0.3, rotationDepth: 0.3 },
  appearance = { backgroundColor: '#0f1620', edgeFadeWidth: 20, edgeFadeOpacity: 1, showShadow: true },
  autoPlaySettings = { autoPlay: false, autoPlaySpeed: 2, pauseOnHover: true },
}) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const isHoveredRef = useRef(false);
  const autoPlayRef = useRef(null);

  const { scrollX } = useScroll({ container: scrollRef });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const visibleCount = 7;

  const duplicatedItems = useMemo(() => {
    if (items.length === 0) return [];
    const result = [];
    const totalNeeded = items.length * 3;
    for (let i = 0; i < totalNeeded; i++) {
      result.push(items[i % items.length]);
    }
    return result;
  }, [items]);

  const singleSetWidth = useMemo(() => {
    return items.length * (layout.itemWidth + layout.spacing);
  }, [items.length, layout.itemWidth, layout.spacing]);

  const totalWidth = useMemo(() => {
    return duplicatedItems.length * (layout.itemWidth + layout.spacing);
  }, [duplicatedItems.length, layout.itemWidth, layout.spacing]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const scrollElement = scrollRef.current;
    const timer = setTimeout(() => {
      const middleItemIndex = items.length + Math.floor(visibleCount / 2);
      scrollElement.scrollLeft = middleItemIndex * (layout.itemWidth + layout.spacing);
    }, 100);

    const handleScroll = () => {
      const scrollLeft = scrollElement.scrollLeft;
      if (scrollLeft >= singleSetWidth * 2) {
        scrollElement.scrollLeft = scrollLeft - singleSetWidth;
      } else if (scrollLeft <= singleSetWidth * 0.5) {
        scrollElement.scrollLeft = scrollLeft + singleSetWidth;
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [singleSetWidth, items.length, layout.itemWidth, layout.spacing]);

  useEffect(() => {
    if (!autoPlaySettings.autoPlay || !scrollRef.current) return;
    const scrollElement = scrollRef.current;

    const startAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        if (!autoPlaySettings.pauseOnHover || !isHoveredRef.current) {
          scrollElement.scrollLeft += autoPlaySettings.autoPlaySpeed;
        }
      }, 30);
    };

    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlaySettings.autoPlay, autoPlaySettings.autoPlaySpeed, autoPlaySettings.pauseOnHover]);

  const handleMouseEnter = () => {
    if (autoPlaySettings.pauseOnHover) isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    if (autoPlaySettings.pauseOnHover) isHoveredRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        perspective: '1000px',
        perspectiveOrigin: 'center center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div
          style={{
            width: totalWidth,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: containerWidth / 2 - layout.itemWidth / 2,
            paddingRight: containerWidth / 2 - layout.itemWidth / 2,
            gap: layout.spacing,
            transformStyle: 'preserve-3d',
          }}
        >
          {duplicatedItems.map((item, index) => (
            <GalleryItem
              key={`${index % items.length}-${Math.floor(index / items.length)}`}
              item={item}
              index={index}
              itemsLength={items.length}
              layout={layout}
              effects3D={effects3D}
              appearance={appearance}
              scrollX={scrollX}
              containerWidth={containerWidth}
            />
          ))}
        </div>
      </div>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${appearance.edgeFadeWidth}%`,
          height: '100%',
          background: `linear-gradient(to right, ${appearance.backgroundColor}, transparent)`,
          opacity: appearance.edgeFadeOpacity,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: `${appearance.edgeFadeWidth}%`,
          height: '100%',
          background: `linear-gradient(to left, ${appearance.backgroundColor}, transparent)`,
          opacity: appearance.edgeFadeOpacity,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </div>
  );
}
