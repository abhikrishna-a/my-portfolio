import { motion } from 'framer-motion';
import Reveal from './Reveal';
import profileImg from '../assets/Abhi.jpeg';

const AnimatedText = ({ text, className, delay = 0 }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: "100%",
      filter: "blur(10px)",
    },
  };

  return (
    <motion.h1
      className={`flex overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ display: 'inline-block' }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col items-center relative">
        {/* Name Headline - Split Design */}
        <div className="flex flex-col items-center leading-[0.8] tracking-tighter uppercase font-black text-7xl md:text-9xl lg:text-[14rem]">
          <AnimatedText text="Creative" className="text-foreground" delay={1.6} />

          {/* Profile Image Badge - Floating in the middle */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 1.8, type: "spring" }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white dark:border-[#111] shadow-2xl z-10 -my-4 md:-my-8 bg-primary/10 flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            <img 
              src={profileImg} 
              alt="Profile" 
              className="w-full h-full object-cover object-[center_15%] grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 border-2 border-white/20 dark:border-white/5 rounded-full"></div>
          </motion.div>

          <AnimatedText text="Developer" className="text-primary z-20" delay={1.7} />
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
        <Reveal delay={2.2} yOffset={10}>
          <div className="mt-20 flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 animate-bounce">
              Scroll down
            </span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-gray-300 to-transparent"></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
