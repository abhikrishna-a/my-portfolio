import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsExiting(true);
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
    <div
      className={`fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ transitionDuration: '800ms' }}
    >
      <div className="absolute bottom-10 right-10 text-6xl md:text-9xl font-black italic opacity-20">
        {progress}%
      </div>
      <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-sm tracking-widest uppercase font-bold text-gray-400">
        Loading Experience
      </div>
    </div>
  );
};

export default Preloader;
