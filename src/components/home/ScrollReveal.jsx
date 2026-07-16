import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Wraps children in a fade-and-slide entrance triggered when they scroll
 * into view. Uses framer-motion's useInView for reliable detection.
 *
 * @param {Object}  props
 * @param {'up'|'down'|'left'|'right'} props.direction  Slide direction
 * @param {number}  props.delay      Extra delay (seconds)
 * @param {number}  props.distance   Slide distance in px
 * @param {number}  props.duration   Transition duration
 * @param {string}  props.className  Optional class name
 */
export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 40,
  duration = 0.7,
  className,
  style,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });

  const offsets = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offsets[direction] }}
      transition={{
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
