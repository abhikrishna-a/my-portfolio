import React, { useEffect, useRef, useState } from 'react';
import useInView from '../../hooks/useInView';

const AnimatedCounter = ({ from = 0, to, suffix = "", className, duration = 2000 }) => {
  const [ref, inView] = useInView({ once: true, margin: "-100px" });
  const [value, setValue] = useState(from);
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime = null;
    let animationFrameId;
    
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      
      // Apply easing
      const currentVal = from + (to - from) * easeOutExpo(progressRatio);
      setValue(currentVal);
      
      if (progress < duration) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setValue(to);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, from, to, duration]);

  return <span ref={ref} className={className}>{Intl.NumberFormat("en-US").format(value.toFixed(0))}{suffix}</span>;
}

export default AnimatedCounter;
