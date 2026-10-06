import { useEffect, useRef } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';
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

// The 20+ figure was dropped on 2026-10-06: nothing in this repo or on GitHub
// supports it (3 featured builds, 15 public repos of which ~10 are distinct
// once forks, the profile README and three portfolio duplicates are removed).
// See SEO.md "Verified claims". Do not restore an uncounted number here.
const measurements = [
  { to: 3, suffix: '', label: 'Featured Projects' },
  { to: 100, suffix: '+', label: 'Problems Solved' },
  { to: 1, suffix: '', label: 'Goal — Build & Ship' },
];

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
      el.style.transform = `scale(${(1 + p * 0.02).toFixed(3)})`;
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
      className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transformOrigin: 'center center' }} />

      {/* Page header row. At <640px the three annotations do not fit on one
          line, and this one used to be display:none there. It now moves to its
          own centred line instead, so nothing is hidden on mobile. At >=sm the
          markup below renders exactly the single row it always did. */}
      <header className="absolute top-6 inset-x-6 md:inset-x-10 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-muted">
        <div className="flex items-center justify-between gap-4">
          <span>Field Log — No. 001</span>
          <span className="hidden sm:inline">Systems Engineering</span>
          <span>Sheet 01 / 05</span>
        </div>
        <span className="mt-1.5 block text-center sm:hidden">Systems Engineering</span>
      </header>

      {/* Margin annotation */}
      <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 items-center gap-3 pointer-events-none">
        <div className="h-px w-14 bg-primary/50" />
        <span className="margin-note">see the builds</span>
      </div>

      <div ref={wrapperRef} className="relative z-20" style={{ transform: 'translateY(0)' }}>
        <div className="flex flex-col items-center text-center px-6 pointer-events-none max-w-[min(56rem,88vw)]">
          <Stagger delay={0.1}>
            <span ref={refs.status} className="stamp stamp-red mb-10" style={{ animation: 'revealUp 0.8s both' }}>
              <span
                className="w-2 h-2 rounded-full bg-current"
                style={{ animation: 'signalBlink 2s ease-in-out infinite' }}
              />
              Open to Opportunities
            </span>
          </Stagger>

          <h1
            ref={refs.name}
            className="relative font-display text-[clamp(1.6rem,10.5vw,3rem)] md:text-7xl lg:text-8xl font-black tracking-[-0.02em] uppercase text-foreground whitespace-nowrap"
            style={{
              textShadow: '0 3px 0 rgba(27,35,51,0.06), 1px 4px 0 rgba(27,35,51,0.04)',
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 select-none"
              style={{
                WebkitTextStroke: '1px rgba(43,79,155,0.14)',
                color: 'transparent',
                transform: 'translate(-0.045em, 0.045em)',
              }}
            >
              <Letters text={NAME} />
            </span>
            <span className="relative inline-block">
              <Letters text={NAME} />
            </span>
          </h1>

          {/* This delay was 0.55 -> 0.2 and back again, measured, and it is not
              worth touching. Hypothesis: introReveal uses fill-mode `both`, so
              this <p> starts at opacity 0 and cannot be an LCP candidate until it
              paints, so the delay should sit directly on top of LCP.
              Result: six Lighthouse mobile runs per arm, back to back, same
              machine, idle. LCP median was 2.95s at 0.2 and 2.99s at 0.55 --
              no difference. Something other than this stagger holds LCP at
              ~2.95s; it is not identified. Kept at 0.55 because 0.2 bought
              nothing and the cascade rhythm is better this way. Do not retry
              this without finding the real constraint first. */}
          <Stagger delay={0.55}>
            <p ref={refs.subtitle} className="mt-6 font-mono text-xs md:text-sm tracking-[0.05em] max-w-[460px] leading-relaxed text-foreground/80">
              Engineering interfaces that feel alive, from the database to the pixel that bends light
            </p>
          </Stagger>

          <Stagger delay={0.62}>
            <div ref={refs.chips} className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-[4px] border border-primary/45 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Stagger>

          {/* Measurements row */}
          <Stagger delay={0.7}>
            <div ref={refs.radec} className="mt-10 w-full max-w-xl">
              <div className="grid grid-cols-3 gap-px border-y border-foreground/20 py-4">
                {measurements.map((m) => (
                  <div key={m.label} className="flex flex-col items-center gap-1 px-2">
                    <AnimatedCounter
                      to={m.to}
                      suffix={m.suffix}
                      className="font-mono text-2xl md:text-3xl font-black text-primary tabular-nums"
                    />
                    <span className="font-mono text-[8px] md:text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Stagger>

          <Stagger delay={0.78}>
            <div ref={refs.ctas} className="mt-10 flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
              <Magnetic>
                <a
                  href="#portfolio"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-background transition-all duration-300 hover:bg-primary-dim motion-safe:active:translate-y-0.5 active:bg-primary-dim focus-visible:bg-primary-dim"
                >
                  View the Builds
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-active:translate-x-0.5 group-focus-within:translate-x-0.5" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md border-[1.5px] border-foreground/70 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-foreground transition-all duration-300 hover:border-primary hover:text-primary active:border-primary focus-visible:border-primary active:text-primary focus-visible:text-primary motion-safe:active:translate-y-0.5"
                >
                  Reach Out
                  <MessageSquare size={15} />
                </a>
              </Magnetic>
            </div>
          </Stagger>

          <Stagger delay={0.86}>
            <div className="mt-12 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
              <span className="h-px w-10 bg-foreground/30" />
              <span>Full Stack Engineer</span>
              <span className="h-px w-10 bg-foreground/30" />
            </div>
          </Stagger>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted">
          Scroll
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-9 w-px bg-foreground/25 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-3 w-px bg-primary animate-scrollDot" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
