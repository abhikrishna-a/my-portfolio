import { useRef } from 'react';

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const box = useRef({ x: 0, y: 0 });

  // Measure once on enter rather than on every move. getBoundingClientRect
  // forces a synchronous layout, and mousemove fires far more often than the
  // layout actually changes. This is the button's own transform, so reading
  // it mid-move was also reading a box that its own effect had moved.
  const handleEnter = (e) => {
    const el = ref.current;
    if (!el) return;
    const { height, width, left, top } = el.getBoundingClientRect();
    box.current = { x: left + width / 2, y: top + height / 2 };
    // Same 0.1s follow lag as before, but set once on enter instead of being
    // reassigned on every single mousemove.
    el.style.transition = 'transform 0.1s linear';
    handleMouse(e);
  };

  const handleMouse = (e) => {
    const el = ref.current;
    if (!el) return;
    const { x, y } = box.current;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    el.style.transform = `translate3d(${dx * 0.3}px, ${dy * 0.3}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.transform = 'translate3d(0px, 0px, 0)';
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
};

export default Magnetic;