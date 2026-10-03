import { useEffect, useRef, useState } from 'react';

const IDLE_HIDE_MS = 1200;

// Only on devices that actually have a fine pointer to replace. A touch
// laptop at 1280px wide matches min-width:1024px, which would have hidden the
// real cursor and left a fake dot tracking a mouse that does not exist.
const CAN_CURSOR = '(hover: hover) and (pointer: fine)';

const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  const cursorDotRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia(CAN_CURSOR);
    if (!mq.matches) return;

    setMounted(true);

    // Re-render only when the visible flag actually flips. Calling setVisible
    // and resetting the idle timer on every mousemove meant a React commit per
    // pointer event -- several hundred a second on a normal mouse.
    const setVisibleIfChanged = (next) => {
      if (isVisibleRef.current === next) return;
      isVisibleRef.current = next;
      setVisible(next);
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setVisibleIfChanged(true);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setVisibleIfChanged(false), IDLE_HIDE_MS);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    let lastX = -1;
    let lastY = -1;

    const render = () => {
      const { x, y } = mouse.current;
      // Skip the style write when the pointer has not moved, so an idle cursor
      // costs nothing, and stop entirely while the tab is in the background --
      // a backgrounded tab still runs rAF here, which is pure waste.
      if (!document.hidden && (x !== lastX || y !== lastY)) {
        lastX = x;
        lastY = y;
        if (cursorDotRef.current) {
          cursorDotRef.current.style.transform =
            `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    const stop = () => { cancelAnimationFrame(animationFrameId); };
    const start = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    };

    document.addEventListener('visibilitychange', start);
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', start);
      stop();
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={cursorDotRef}
      className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[999999] transition-opacity duration-300"
      style={{ willChange: 'transform', opacity: visible ? 1 : 0 }}
    />
  );
};

export default CustomCursor;