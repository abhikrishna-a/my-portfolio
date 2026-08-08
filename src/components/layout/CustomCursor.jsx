import { useEffect, useRef, useState } from 'react';

const IDLE_HIDE_MS = 1200;

const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  const cursorDotRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    if (!mq.matches) return;

    setMounted(true);

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setVisible(false), IDLE_HIDE_MS);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;

    const render = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
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
