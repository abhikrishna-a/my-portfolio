import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const Reveal = ({ 
  children, 
  width = "fit-content", 
  delay = 0.2, 
  yOffset = 20,
  duration = 0.5 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1.0] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;
