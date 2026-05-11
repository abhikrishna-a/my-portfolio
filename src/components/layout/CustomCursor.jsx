import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!mounted) setMounted(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('data-cursor') === 'hover'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    let animationFrameId;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render = () => {
      delayedMouse.current = {
        x: lerp(delayedMouse.current.x, mouse.current.x, 0.15),
        y: lerp(delayedMouse.current.y, mouse.current.y, 0.15)
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
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[999999] mix-blend-difference hidden lg:block"
        style={{ willChange: 'transform' }}
      />
      
      {/* Trailing Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[999998] hidden lg:block transition-[opacity,scale] duration-300 ease-out"
        style={{
          scale: isHovering ? '2' : '1',
          opacity: isHovering ? 0.5 : 1,
          willChange: 'transform, scale, opacity'
        }}
      />
    </>
  );
};

export default CustomCursor;
