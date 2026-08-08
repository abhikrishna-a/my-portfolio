import { useEffect, useRef } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import HeroBackground from '../effects/HeroBackground';
import HudOverlay from '../ui/HudOverlay';
import Magnetic from '../ui/Magnetic';
import useHeroCollapse from '../../hooks/useHeroCollapse';
import useReducedMotion from '../effects/useReducedMotion';

const collapseConfig = [
  { key: 'status', offset: 0.0, rot: -14 },
  { key: 'radec', offset: 0.05, rot: 12 },
  { key: 'subtitle', offset: 0.1, rot: -10 },
  { key: 'name', offset: 0.15, rot: 8 },
  { key: 'chips', offset: 0.08, rot: -6 },
  { key: 'ctas', offset: 0.18, rot: 6 },
];

const NAME = 'ABHIKRISHNA';
const CHIPS = ['React', 'Django REST', 'REST APIs'];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const Stagger = ({ children, delay, className = '' }) => (
  <div
    className={className}
    style={{
      animation: `introReveal 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
    }}
  >
    {children}
  </div>
);

const Letters = ({ text, base = 0.25, step = 0.04 }) =>
  text.split('').map((ch, i) => (
    <span
      key={`${text}-${i}`}
      className="inline-block"
      style={{
        animation: `letterIn 0.9s cubic-bezier(0.2,0.8,0.2,1) ${base + i * step}s both`,
      }}
    >
      {ch}
    </span>
  ));

const Hero = () => {
  const { sectionRef, wrapperRef, refs } = useHeroCollapse(collapseConfig);
  const reduced = useReducedMotion();
  const bgRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const el = bgRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    let raf = 0;
    const apply = () => {
      const sr = section.getBoundingClientRect();
      const p = clamp(-sr.top / sr.height, 0, 1);
      el.style.transform = `scale(${(1 + p * 0.15).toFixed(3)})`;
      el.style.filter = `blur(${(p * 8).toFixed(2)}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: 'center center' }}
      >
        <HeroBackground />
      </div>
      <HudOverlay />

      <div ref={wrapperRef} className="relative z-20" style={{ transform: 'translateY(0)' }}>
        <div
          className="absolute -inset-x-10 -inset-y-8 -z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 75%)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            borderRadius: '24px',
          }}
        />
        <div className="flex flex-col items-center text-center px-6 pointer-events-none max-w-[min(52vw,760px)]">
          <Stagger delay={0.1}>
            <span className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 text-primary">
              Portfolio Transmission
            </span>
          </Stagger>

          <h1
            ref={refs.name}
            className="relative font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.06em] uppercase text-white"
            style={{
              textShadow: '0 0 40px rgba(230,126,34,0.4), 0 0 80px rgba(230,126,34,0.15), 0 0 120px rgba(230,126,34,0.05), 0 0 140px rgba(56,189,248,0.08)',
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 select-none"
              style={{
                WebkitTextStroke: '1px rgba(56,189,248,0.22)',
                color: 'transparent',
                transform: 'translate(-0.045em, 0.045em)',
              }}
            >
              <Letters text={NAME} />
            </span>
            <span className="relative inline-block">
              <Letters text={NAME} />
            </span>

            {/* Rotating role ring */}
            <span className="hidden lg:block absolute -right-44 top-1/2 -translate-y-1/2 w-44 h-44 pointer-events-none">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                style={{ animation: 'spinSlow 22s linear infinite' }}
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="heroRingPath"
                    d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                    fill="none"
                  />
                </defs>
                <text className="font-mono" fill="rgba(255,157,58,0.55)" fontSize="11.5" letterSpacing="3">
                  <textPath href="#heroRingPath">FULL STACK DEVELOPER • OPEN TO WORK •</textPath>
                </text>
              </svg>
            </span>
          </h1>

          <Stagger delay={0.55}>
            <p ref={refs.subtitle} className="mt-6 font-mono text-xs md:text-sm tracking-[0.05em] max-w-[440px] leading-relaxed text-white">
              Engineering interfaces that feel alive, from the database to the pixel that bends light
            </p>
          </Stagger>

          <Stagger delay={0.62}>
            <div ref={refs.chips} className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary-hair px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Stagger>

          <Stagger delay={0.7}>
            <div ref={refs.ctas} className="mt-9 flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
              <Magnetic>
                <a
                  href="#portfolio"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_30px_-6px_rgba(230,126,34,0.55)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_44px_-4px_rgba(230,126,34,0.85)]"
                >
                  View Work
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="glow-border inline-flex items-center gap-2 rounded-full border border-primary-hair px-8 py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-primary transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
                >
                  Get in Touch
                  <MessageSquare size={15} />
                </a>
              </Magnetic>
            </div>
          </Stagger>

          <Stagger delay={0.78}>
            <div ref={refs.status} className="mt-8 flex items-center gap-2">
              <span
                className="w-[6px] h-[6px] rounded-full bg-accent"
                style={{ animation: 'signalBlink 2s ease-in-out infinite' }}
              />
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-accent">
                Signal Active
              </span>
            </div>
          </Stagger>

          <Stagger delay={0.84}>
            <p ref={refs.radec} className="mt-3 font-mono text-[9px] tracking-[0.15em] text-white">
              RA 17h 45m 40.0s / DEC -29&deg; 00&prime; 28.1&Prime;
            </p>
          </Stagger>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber/50">
          Scroll
        </span>
        <div className="w-5 h-9 rounded-full border border-amber/30 flex justify-center pt-1.5">
          <span className="w-1 h-2 rounded-full bg-amber/70 animate-scrollDot" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
