import useInView from '../../hooks/useInView';

const getHiddenTransform = (origin, distance, scale) => {
  const dx = origin === 'left' ? -1 : origin === 'right' ? 1 : 0;
  const dy = origin === 'top' ? -1 : origin === 'bottom' ? 1 : 0;
  return `translate(${dx * distance}px, ${dy * distance}px) scale(${scale})`;
};

const Reveal = ({
  children,
  width = "fit-content",
  delay = 0,
  duration = 0.9,
  origin = 'top',
  distance = 30,
  scale = 1,
  reset = true,
  clip = false,
}) => {
  const [ref, isInView] = useInView({ once: !reset, margin: '-80px' });

  return (
    <div ref={ref} style={{ position: 'relative', width, overflow: clip ? 'hidden' : 'visible' }}>
      <div
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'none' : getHiddenTransform(origin, distance, scale),
          transition: `opacity ${duration}s cubic-bezier(0.5, 0, 0, 1), transform ${duration}s cubic-bezier(0.5, 0, 0, 1)`,
          transitionDelay: `${delay}s`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Reveal;
