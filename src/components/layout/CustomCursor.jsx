import { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const hoverRef = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    if (!mq.matches) return;

    setMounted(true);

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const hovering =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('data-cursor') === 'hover';
      hoverRef.current = hovering;
      setIsHovering(hovering);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    let animationFrameId;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render = () => {
      delayedMouse.current = {
        x: lerp(delayedMouse.current.x, mouse.current.x, 0.15),
        y: lerp(delayedMouse.current.y, mouse.current.y, 0.15),
      };

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${delayedMouse.current.x}px, ${delayedMouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[999999] mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[999998] transition-[opacity,scale] duration-300 ease-out"
        style={{
          scale: isHovering ? '2' : '1',
          opacity: isHovering ? 0.5 : 1,
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
