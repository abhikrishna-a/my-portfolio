import { useState, useEffect } from 'react';
import useReducedMotion from '../effects/useReducedMotion';

// The overlay length is a fixed time budget rather than a tick count, so it is
// the same ~720ms whether the tab is foregrounded, throttled, or on a slow phone.
const FILL_MS = 360;
const HOLD_MS = 160;
const OUT_MS = 200;

const Preloader = () => {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / FILL_MS);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const exitAt = setTimeout(() => setIsExiting(true), FILL_MS + HOLD_MS);
    const doneAt = setTimeout(() => setIsDone(true), FILL_MS + HOLD_MS + OUT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitAt);
      clearTimeout(doneAt);
    };
  }, [reduced]);

  if (reduced || isDone) return null;

  const phase = progress >= 100 ? 'complete' : 'loading';

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-background text-foreground flex flex-col items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.76,0,0.24,1)] ${
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
          className="absolute top-0 left-0 h-full bg-primary"
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
