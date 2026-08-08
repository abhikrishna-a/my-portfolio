const stats = [
  "Full Stack Development",
  "REST API & Backend Systems",
  "Database Design & Optimization",
  "Clean Code & Best Practices",
  "UI Engineering",
  "React & Django",
];

const Marquee = () => {
  return (
    <div className="relative w-full py-12 md:py-16 text-primary overflow-hidden border-y border-foreground/10 bg-background">
      <div className="flex whitespace-nowrap">
        <div className="flex items-center gap-10 w-max pr-10 whitespace-nowrap font-mono text-2xl md:text-4xl font-black uppercase tracking-[0.18em] animate-marquee">
          {[...stats, ...stats].map((stat, index) => (
            <span key={index} className="shrink-0 flex items-center gap-10">
              <span className="text-primary-dim">{stat}</span>
              <span className="text-amber/50 text-base md:text-xl">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
