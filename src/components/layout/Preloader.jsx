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
      className={`fixed inset-0 z-[99999] bg-background text-foreground flex flex-col items-center justify-center transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="log-paper absolute inset-0" aria-hidden="true" />

      <span className="stamp stamp-red mb-8">Printing Log</span>

      <span className="relative font-mono text-7xl md:text-8xl font-black text-foreground/15 tabular-nums">
        {progress}%
      </span>

      <div className="relative mt-8 w-56 h-[3px] bg-foreground/15 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
        {phase === 'loading' && (
          <div
            className="absolute top-0 left-0 h-full w-16 animate-streak"
            style={{
              background: 'linear-gradient(90deg, transparent, #2b4f9b, transparent)',
              opacity: 0.6,
            }}
          />
        )}
      </div>

      <div className="mt-5 font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
        {phase === 'loading' ? 'Inking Sheets' : 'Log Ready'}
      </div>
    </div>
  );
};

export default Preloader;
