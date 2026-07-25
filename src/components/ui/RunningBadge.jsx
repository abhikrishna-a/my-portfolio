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
    <div className="relative w-full py-3 bg-black overflow-hidden border-y border-white/5">
      <div className="flex whitespace-nowrap">
        <div
          className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary-dim animate-comet"
        >
          {repeated.map((item, i) => (
            <span key={i} className="flex items-center gap-4">
              <span>{item}</span>
              <span className="text-primary/30">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunningBadge;
