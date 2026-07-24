import { useState, useEffect } from 'react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase('complete');
          setTimeout(() => setIsExiting(true), 400);
          setTimeout(() => setIsLoading(false), 1200);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center transition-all duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-primary-dim mb-6">
        Initializing
      </span>

      <span className="font-mono text-6xl md:text-8xl font-black italic text-white/10 tabular-nums">
        {progress}%
      </span>

      <div className="mt-6 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
        {phase === 'loading' && (
          <div
            className="absolute top-0 left-0 h-full w-14 animate-streak"
            style={{
              background: 'linear-gradient(90deg, transparent, #E67E22, transparent)',
              opacity: 0.6,
            }}
          />
        )}
      </div>

      <div className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase text-primary-dim">
        {phase === 'loading' ? 'Loading Experience' : 'Ready'}
      </div>
    </div>
  );
};

export default Preloader;
