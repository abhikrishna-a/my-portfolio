import { useState, useEffect, useRef } from 'react';

export default function HudOverlay() {
  const [clock, setClock] = useState('00:00:00');
  const grainRef = useRef(null);
  const [grainVisible, setGrainVisible] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toTimeString().slice(0, 8));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = grainRef.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setGrainVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0px, rgba(255,255,255,.025) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'screen',
          opacity: 0.5,
        }}
      />
      {/* Film grain */}
      <svg
        ref={grainRef}
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          opacity: grainVisible ? 0.05 : 0,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          animation: grainVisible ? 'grainShift 0.4s steps(2) infinite' : 'none',
        }}
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px 60px rgba(3,2,1,0.7)',
        }}
      />

      {/* ── HUD corner brackets ── */}
      <div className="absolute top-[20px] left-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-r-0 border-b-0 animate-cornerFlick" />
      <div className="absolute top-[20px] right-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-l-0 border-b-0 animate-cornerFlick" />
      <div className="absolute bottom-[20px] left-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-r-0 border-t-0 animate-cornerFlick" />
      <div className="absolute bottom-[20px] right-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-l-0 border-t-0 animate-cornerFlick" />

      {/* ── Telemetry: top-left ── */}
      <div className="absolute top-[64px] left-[24px] hidden md:block">
        <p className="font-mono text-[9px] tracking-[0.15em] text-amber/50">
          SECTOR: SGR A* // GALACTIC CENTER
        </p>
      </div>

      {/* ── Telemetry: top-right ── */}
      <div className="absolute top-[64px] right-[24px] hidden md:block text-right">
        <p className="font-mono text-[9px] tracking-[0.15em] text-amber/50">
          FREQ: 1.4 GHz // STATUS: NOMINAL
        </p>
      </div>

      {/* ── Telemetry: bottom-left ── */}
      <div className="absolute bottom-[64px] left-[24px] hidden md:block">
        <p className="font-mono text-[9px] tracking-[0.15em] text-amber/50">
          MISSION CLOCK: {clock}
        </p>
      </div>

      {/* ── Telemetry: bottom-right ── */}
      <div className="absolute bottom-[64px] right-[24px] hidden md:block text-right">
        <p className="font-mono text-[9px] tracking-[0.15em] text-amber/50">
          SIGNAL <span className="text-accent">{'\u2588'.repeat(8)}</span>{'\u2591'.repeat(2)} 82%
        </p>
      </div>

      {/* ── Telemetry: REC indicator ── */}
      <div className="absolute bottom-[88px] right-[24px] hidden md:block text-right">
        <p className="font-mono text-[9px] tracking-[0.15em] text-amber/50 flex items-center justify-end gap-2">
          <span
            className="w-[6px] h-[6px] rounded-full bg-accent"
            style={{ animation: 'signalBlink 1.4s ease-in-out infinite' }}
          />
          REC
        </p>
      </div>
    </div>
  );
}
