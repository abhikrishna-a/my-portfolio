import React from 'react';

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
    <div className="relative w-full py-12 md:py-20 bg-black text-white overflow-hidden transform skew-y-2 translate-y-[-2rem] z-20">
      <div className="flex whitespace-nowrap">
        <div
          className="flex items-center gap-8 text-4xl md:text-6xl font-black uppercase tracking-tighter"
          style={{
            animation: "marquee 20s linear infinite",
          }}
        >
          {/* Double content for seamless looping */}
          {[...stats, ...stats].map((stat, index) => (
            <span key={index} className={index % 2 === 0 ? "text-primary" : "text-white"}>
              {stat}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
