const stats = [
  "10+ HOURS OF CODING •",
  "100+ PROBLEMS SOLVED •",
  "REST API & BACKEND SYSTEMS •",
  "FULLSTACK DEVELOPMENT •",
  "DATABASE DESIGN & OPTIMIZATION •",
  "CLEAN CODE & BEST PRACTICES •"
];

const Marquee = () => {
  return (
    <div className="relative w-full py-12 md:py-20 text-white overflow-hidden transform skew-y-1 translate-y-[-2rem] z-20">
      <div className="flex whitespace-nowrap">
        <div
          className="flex items-center gap-8 font-mono text-3xl md:text-5xl font-black uppercase tracking-[0.24em] animate-marquee"
        >
          {[...stats, ...stats].map((stat, index) => (
            <span key={index} className={index % 2 === 0 ? 'text-primary' : 'text-accent'}>
              {stat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
