import { createRef, useEffect, useMemo, useRef } from 'react';
import useReducedMotion from '../components/effects/useReducedMotion';

/* ================================================================
   useHeroCollapse — scroll-linked gravitational collapse of the
   hero text block. As the hero scrolls past (p: 0 → 1), each text
   element is pulled toward the hero's center-of-gravity convergence
   point while shrinking, fading, and spiraling slightly — pure
   transform/opacity, compositor-only, fully reversible.

   Config entries:
     { key, offset, rot }
       key    — unique id; returned ref is refs[key]
       offset — local progress remap (stagger). 0 = collapses with
                the master scroll; larger = collapses later.
       rot    — max rotation (deg) at full collapse; sign alternates
                per element for a spiral feel.

   Honors prefers-reduced-motion: skips the effect entirely so the
   text scrolls away naturally.
   ================================================================ */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const easeIn = (t) => t * t;

const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export default function useHeroCollapse(config) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const refs = useMemo(() => {
    const map = {};
    for (const { key } of config) map[key] = createRef();
    return map;
  }, [config]);
  const centers = useRef({});

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const wrap = wrapperRef.current;
    if (!section || !wrap) return;

    let raf = 0;
    let ticking = false;
    let captureTimer = null;

    const capture = () => {
      const wr = wrap.getBoundingClientRect();
      const cx = wr.left + wr.width / 2;
      const cy = wr.top + wr.height / 2;
      for (const { key } of config) {
        const el = refs[key].current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        centers.current[key] = {
          dx: cx - (r.left + r.width / 2),
          dy: cy - (r.top + r.height / 2),
        };
      }
    };

    const apply = () => {
      const sr = section.getBoundingClientRect();
      const p = clamp(-sr.top / sr.height, 0, 1);

      if (p <= 0.001) {
        for (const { key } of config) {
          const el = refs[key].current;
          if (!el) continue;
          el.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
          el.style.opacity = '1';
          el.style.willChange = 'auto';
        }
        capture();
        return;
      }

      for (const { key, offset, rot } of config) {
        const el = refs[key].current;
        if (!el) continue;
        const local = clamp((p - offset) / (1 - offset), 0, 1);
        const e = easeIn(local);
        const c = centers.current[key] || { dx: 0, dy: 0 };
        const tx = c.dx * e;
        const ty = c.dy * e;
        const scale = 1 - 0.85 * e;
        const rotate = rot * e;
        const opacity = 1 - smoothstep(0.3, 1, local);

        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.willChange = 'transform';
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    handleScroll();

    captureTimer = setTimeout(handleScroll, 1300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(raf);
      clearTimeout(captureTimer);
    };
  }, [reduced, config, refs]);

  return { sectionRef, wrapperRef, refs };
}
