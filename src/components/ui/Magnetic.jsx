import { useRef } from 'react';

const Magnetic = ({ children }) => {
  const ref = useRef(null);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    ref.current.style.transform = `translate(${middleX * 0.3}px, ${middleY * 0.3}px)`;
    ref.current.style.transition = 'transform 0.1s linear';
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
};

export default Magnetic;
