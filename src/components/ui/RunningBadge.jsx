import { useMemo } from 'react';

const items = [
  "Available for Freelance",
  "Full Stack Developer",
  "Open to Opportunities",
];

const repeatedItems = [...items, ...items, ...items, ...items, ...items, ...items];

const RunningBadge = () => {
  const repeated = useMemo(() => repeatedItems, []);

  return (
    <div className="relative w-full py-3 overflow-hidden border-y border-foreground/10 bg-secondary">
      <div className="flex whitespace-nowrap">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary-dim animate-marquee">
          {repeated.map((item, i) => (
            <span key={i} className="flex items-center gap-6">
              <span>{item}</span>
              <span className="text-amber/60">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunningBadge;
