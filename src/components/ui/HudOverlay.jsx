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
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 55%, rgba(0,0,0,.55) 100%)',
        }}
      />
      {/* Corner brackets */}
      <div className="absolute top-[22px] left-[22px] w-[34px] h-[34px] border border-primary-hair border-r-0 border-b-0 animate-cornerFlick" />
      <div className="absolute top-[22px] right-[22px] w-[34px] h-[34px] border border-primary-hair border-l-0 border-b-0 animate-cornerFlick" />
      <div className="absolute bottom-[22px] left-[22px] w-[34px] h-[34px] border border-primary-hair border-r-0 border-t-0 animate-cornerFlick" />
      <div className="absolute bottom-[22px] right-[22px] w-[34px] h-[34px] border border-primary-hair border-l-0 border-t-0 animate-cornerFlick" />
    </div>
  );
}
