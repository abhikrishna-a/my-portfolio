import { useState, useEffect } from 'react';
import HeroBackground from '../effects/HeroBackground';
import HudOverlay from '../ui/HudOverlay';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030201]"
    >
      <HeroBackground />
      <HudOverlay />

      <div
        className="relative z-20 flex flex-col items-center text-center px-6 pointer-events-none"
        style={{ animation: 'introReveal 1.1s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
      >
        <div
          className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4"
          style={{ color: '#ff9d3a' }}
        >
          Portfolio Transmission
        </div>
        <h1
          className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.08em] uppercase"
          style={{
            color: '#f2ece0',
            textShadow: '0 0 30px rgba(255,157,58,0.25)',
          }}
        >
          Abhikrishna
        </h1>
        <p
          className="mt-6 font-mono text-xs md:text-sm tracking-[0.05em] max-w-[420px] leading-relaxed"
          style={{ color: '#7a6f5f' }}
        >
          Engineering interfaces that feel alive, from the database to the pixel that bends light
        </p>
      </div>
    </section>
  );
};

export default Hero;
