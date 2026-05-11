import React, { useRef } from 'react';
import Reveal from '../ui/Reveal';
import profileImg from '../../assets/Abhi.jpeg';
import useParallax from '../../hooks/useParallax';

const AnimatedText = ({ text, className, delay = 0 }) => {
  const letters = Array.from(text);

  return (
    <h1 className={`flex overflow-hidden ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block animate-revealUp"
          style={{
            animationDuration: '0.8s',
            animationDelay: `${delay + (index * 0.05)}s`,
            animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </h1>
  );
};

const ScrollIndicator = ({ delay }) => {
  const scrollY = useParallax();
  const progress = Math.min(scrollY / 100, 1);
  const opacity = 1 - progress;
  const scale = 1 - (progress * 0.2);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        willChange: 'opacity, transform'
      }}
      className="mt-20 flex flex-col items-center"
    >
      <Reveal delay={delay} yOffset={10}>
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-muted rounded-full p-1 flex justify-center">
            <div className="w-1 h-2 bg-primary animate-scroll-dot rounded-full"></div>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mt-4">
            Scroll
          </span>
        </div>
      </Reveal>
    </div>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const scrollY = useParallax();

  // Calculate progress assuming hero is 100vh
  // To avoid errors before mount, assume 1000px if window is undefined
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const progress = Math.min(Math.max(scrollY / vh, 0), 1);

  const y1 = progress * -200;
  const y2 = progress * 150;
  const xLeft = progress * -100;
  const xRight = progress * 100;
  const scrollScale = 1 + (progress * 0.2);
  const rotate = progress * 5;

  return (
    <section
      id="home"
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden relative"
    >
      <div className="max-w-7xl w-full flex flex-col items-center relative z-10">
        {/* Name Headline - Split Design */}
        <div className="flex flex-col items-center leading-[0.8] tracking-tighter uppercase font-black text-7xl md:text-9xl lg:text-[14rem]">
          <div style={{ transform: `translate(${xLeft}px, ${y1}px)`, willChange: 'transform' }}>
            <AnimatedText text="Creative" className="text-foreground" delay={1.6} />
          </div>

          {/* Profile Image Badge - Floating in the middle */}
          <div
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white dark:border-[#111] shadow-2xl z-10 -my-4 md:-my-8 bg-primary/10 flex items-center justify-center relative animate-scaleUp"
            style={{
              animationDelay: '1.8s',
              animationDuration: '1s',
              animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
              transform: `translateY(${y2}px) scale(${scrollScale}) rotate(${rotate}deg)`,
              willChange: 'transform'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full object-cover object-[center_15%] grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 border-2 border-white/20 dark:border-white/5 rounded-full"></div>
          </div>

          <div style={{ transform: `translate(${xRight}px, ${y1}px)`, willChange: 'transform' }}>
            <AnimatedText text="Developer" className="text-primary z-20" delay={1.7} />
          </div>
        </div>

        {/* Subtitle / Intro */}
        <Reveal delay={2.0}>
          <div className="mt-12 text-center max-w-2xl">
            <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
              I craft digital experiences that blend <span className="text-foreground font-bold italic">bold design</span> with <span className="text-foreground font-bold italic">seamless functionality</span>. Currently based in the digital world.
            </p>
          </div>
        </Reveal>

        {/* Scroll Indicator */}
        <ScrollIndicator delay={2.2} />
      </div>
    </section>
  );
};

export default Hero;

