import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../ui/Reveal';
import profileImg from '../../assets/Abhi.jpeg';

const AnimatedText = ({ text, className, delay = 0 }) => {
  const letters = Array.from(text);

  return (
    <h1 className={`flex overflow-hidden ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: delay + (index * 0.05),
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </h1>
  );
};

const ScrollIndicator = ({ delay }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.8]);

  return (
    <motion.div 
      style={{ opacity, scale }}
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
    </motion.div>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const xLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const xRight = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden relative"
    >
      <div className="max-w-7xl w-full flex flex-col items-center relative z-10">
        {/* Name Headline - Split Design */}
        <div className="flex flex-col items-center leading-[0.8] tracking-tighter uppercase font-black text-7xl md:text-9xl lg:text-[14rem]">
          <motion.div style={{ x: xLeft, y: y1 }}>
            <AnimatedText text="Creative" className="text-foreground" delay={1.6} />
          </motion.div>

          {/* Profile Image Badge - Floating in the middle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white dark:border-[#111] shadow-2xl z-10 -my-4 md:-my-8 bg-primary/10 flex items-center justify-center relative"
            style={{ 
              scale: scrollScale,
              rotate,
              y: y2
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full object-cover object-[center_15%] grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 border-2 border-white/20 dark:border-white/5 rounded-full"></div>
          </motion.div>

          <motion.div style={{ x: xRight, y: y1 }}>
            <AnimatedText text="Developer" className="text-primary z-20" delay={1.7} />
          </motion.div>
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

