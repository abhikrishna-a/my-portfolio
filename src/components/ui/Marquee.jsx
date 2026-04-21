import React from 'react';
import { motion } from 'framer-motion';

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
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex items-center gap-8 text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >
          {/* Double content for seamless looping */}
          {[...stats, ...stats].map((stat, index) => (
            <span key={index} className={index % 2 === 0 ? "text-primary" : "text-white"}>
              {stat}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Marquee;
