import React from 'react';
import useInView from '../../hooks/useInView';

const Reveal = ({
  children,
  width = "fit-content",
  delay = 0.2,
  yOffset = 30,
  duration = 0.6
}) => {
  const [ref, isInView] = useInView({ once: true, margin: "-100px" });

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <div
        className={`${isInView ? 'animate-revealUp' : 'opacity-0'}`}
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Reveal;
