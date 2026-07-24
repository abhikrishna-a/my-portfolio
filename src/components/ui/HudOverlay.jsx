export default function HudOverlay() {
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
      {/* Film grain — SVG feTurbulence with position-anim jitter */}
      <svg
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.05,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          animation: 'grainShift 0.4s steps(2) infinite',
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
      {/* HUD corner brackets — amber */}
      <div className="absolute top-[20px] left-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-r-0 border-b-0 animate-cornerFlick" />
      <div className="absolute top-[20px] right-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-l-0 border-b-0 animate-cornerFlick" />
      <div className="absolute bottom-[20px] left-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-r-0 border-t-0 animate-cornerFlick" />
      <div className="absolute bottom-[20px] right-[20px] w-[36px] h-[36px] border border-[rgba(255,157,58,0.5)] border-l-0 border-t-0 animate-cornerFlick" />
    </div>
  );
}
