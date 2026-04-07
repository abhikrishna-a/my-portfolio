import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 800); // Unmount after exit animation
          return 100;
        }
        return prev + 2; // Fixed exact timing (1000ms total)
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: progress === 100 ? "-100%" : 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      className="fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center"
    >
      <div className="absolute bottom-10 right-10 text-6xl md:text-9xl font-black italic opacity-20">
        {progress}%
      </div>
      <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-sm tracking-widest uppercase font-bold text-gray-400">
        Loading Experience
      </div>
    </motion.div>
  );
};

export default Preloader;
