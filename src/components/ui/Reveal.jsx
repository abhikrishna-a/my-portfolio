import useInView from '../../hooks/useInView';
import useReducedMotion from '../effects/useReducedMotion';

const getHiddenTransform = (origin, distance, scale) => {
  const dx = origin === 'left' ? -1 : origin === 'right' ? 1 : 0;
  const dy = origin === 'top' ? -1 : origin === 'bottom' ? 1 : 0;
  return `translate(${dx * distance}px, ${dy * distance}px) scale(${scale})`;
};

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

const Reveal = ({
  children,
  width = "fit-content",
  delay = 0,
  duration = 0.6,
  origin = 'top',
  distance = 30,
  scale = 1,
  reset = false,
  clip = false,
}) => {
  const reduced = useReducedMotion();
  const [ref, isInView] = useInView({ once: !reset, margin: '-80px' });

  const visible = reduced || isInView;

  return (
    <div ref={ref} style={{ position: 'relative', width, overflow: clip ? 'hidden' : 'visible' }}>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : getHiddenTransform(origin, distance, scale),
          transition: `opacity ${duration}s ${EASE_OUT}, transform ${duration}s ${EASE_OUT}`,
          transitionDelay: reduced ? '0s' : `${delay}s`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Reveal;
