import { useEffect, useRef, useState } from 'react';
import useInView from '../../hooks/useInView';
import useReducedMotion from '../effects/useReducedMotion';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const AnimatedCounter = ({ from = 0, to, suffix = "", className, duration = 2000 }) => {
  const [ref, inView] = useInView({ once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(from);
  const lastRendered = useRef(Math.round(from));

  useEffect(() => {
    if (!inView) return;

    // Reduced motion: land on the final number, no counting.
    if (reduced) {
      lastRendered.current = Math.round(to);
      setValue(to);
      return;
    }

    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);

      const currentVal = from + (to - from) * easeOutExpo(progressRatio);

      // Only commit when the rendered digit actually changes. The animation
      // ran at display rate (~120 commits over 2s) but the text only shows a
      // whole number, so well over half of those commits re-rendered an
      // identical string.
      const rounded = Math.round(currentVal);
      if (rounded !== lastRendered.current) {
        lastRendered.current = rounded;
        setValue(rounded);
      }

      if (progress < duration) {
        animationFrameId = window.requestAnimationFrame(step);
      } else if (lastRendered.current !== to) {
        lastRendered.current = to;
        setValue(to);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, reduced, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(0)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;