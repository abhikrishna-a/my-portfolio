export default function LogbookPaper() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 log-paper" />

      <svg className="absolute inset-0 h-full w-full mix-blend-multiply opacity-40" aria-hidden="true">
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" opacity="0.28" />
      </svg>

      <div className="hidden lg:block absolute left-6 top-[11%] punch-hole" />
      <div className="hidden lg:block absolute left-6 top-[44%] punch-hole" />
      <div className="hidden lg:block absolute left-6 top-[77%] punch-hole" />

      <div className="absolute inset-x-0 top-0 h-px bg-foreground/10" />
    </div>
  );
}
