import { useEffect, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

/* ================================================================
   Starfield — canvas starfield behind the site's below-hero
   sections. Twinkling stars with slow parallax drift plus the
   occasional shooting star. Pure canvas (no WebGL/three.js).

   Props:
     count        — number of stars (default 300)
     shootingRange — [min, max] seconds between shooting stars
     className    — canvas positioning class
     starScale    — star size multiplier (default 1)
     lensStrength — gravitational-lensing strength; 0 disables (default 0).
                    Stars within lensRadius bulge outward around the cursor
                    like light bending around a black hole. Active only
                    while the mouse is moving; stars ease back when it stops.
     lensRadius   — lens influence radius in px (default 240)
     maxShooters  — max simultaneous shooting stars (default 2)

   Honors prefers-reduced-motion: renders a single static frame,
   no animation loop, no shooting stars, no lensing.
   ================================================================ */

const STAR_COLORS = [
  '255,255,255',
  '230,214,190',
  '56,189,248',
];

const MOUSE_MOVE_TIMEOUT_MS = 120;

function makeStars(width, height, dpr, count, starScale) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: (Math.random() * 1.1 + 0.3) * dpr * starScale,
    base: 0.25 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.9,
    drift: 0.02 + Math.random() * 0.06,
    vx: 0,
    vy: 0,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));
}

export default function Starfield({
  count = 300,
  shootingRange = [2.5, 4],
  className = 'fixed inset-0 z-0 pointer-events-none',
  starScale = 1,
  lensStrength = 0,
  lensRadius = 240,
  maxShooters = 2,
}) {
  const reduced = useReducedMotion();
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const shootersRef = useRef([]);
  const nextShootRef = useRef(0);
  const lastMoveAtRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const offsetRef = useRef({ left: 0, top: 0 });
  const [shootMin, shootMax] = shootingRange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;

    const cacheOffset = () => {
      const rect = canvas.getBoundingClientRect();
      offsetRef.current = { left: rect.left, top: rect.top };
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cacheOffset();
      starsRef.current = makeStars(width, height, dpr, count, starScale);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of starsRef.current) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${s.base})`;
        ctx.fill();
      }
    };

    const spawnShooter = () => {
      if (shootersRef.current.length >= maxShooters) return;
      const fromLeft = Math.random() > 0.5;
      const len = 80 + Math.random() * 120;
      const speed = 4 + Math.random() * 5;
      const x = fromLeft ? -20 : width + 20;
      const y = Math.random() * height * 0.5;
      const dx = fromLeft ? speed : -speed;
      const dy = 1.5 + Math.random() * 1.5;
      shootersRef.current.push({ x, y, dx, dy, life: 1, len, color: '220,240,255' });
    };

    const handleMouseMove = (e) => {
      lastMoveAtRef.current = performance.now();
      mouseRef.current = {
        x: e.clientX - offsetRef.current.left,
        y: e.clientY - offsetRef.current.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const frame = (t) => {
      const time = t / 1000;
      cacheOffset();
      ctx.clearRect(0, 0, width, height);

      const { x: mx, y: my, active } = mouseRef.current;
      const moving = performance.now() - lastMoveAtRef.current < MOUSE_MOVE_TIMEOUT_MS;
      const hasLens = lensStrength > 0 && active && moving;

      for (const s of starsRef.current) {
        const twinkle = 0.6 + 0.4 * Math.sin(time * s.speed + s.phase);

        if (hasLens) {
          const dx = s.x - mx;
          const dy = s.y - my;
          const dist = Math.hypot(dx, dy);

          if (dist > 0.01 && dist < lensRadius) {
            const falloff = 1 - dist / lensRadius;
            const push = 1 + falloff * falloff * lensStrength;
            const tx = mx + dx * push;
            const ty = my + dy * push;
            s.vx += (tx - s.x) * 0.09;
            s.vy += (ty - s.y) * 0.09;
          }
        }

        s.vx *= 0.91;
        s.vy *= 0.91;
        const speed = Math.hypot(s.vx, s.vy);
        const maxSpeed = 3.5;
        if (speed > maxSpeed) {
          s.vx = (s.vx / speed) * maxSpeed;
          s.vy = (s.vy / speed) * maxSpeed;
        }

        s.x += s.drift + s.vx;
        s.y += s.vy;

        if (s.x > width + 2) s.x = -2;
        else if (s.x < -2) s.x = width + 2;
        if (s.y > height + 2) s.y = -2;
        else if (s.y < -2) s.y = height + 2;

        const alpha = s.base * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.fill();
      }

      if (time > nextShootRef.current) {
        spawnShooter();
        nextShootRef.current = time + shootMin + Math.random() * (shootMax - shootMin);
      }

      shootersRef.current = shootersRef.current.filter((sh) => {
        sh.x += sh.dx;
        sh.y += sh.dy;
        sh.life -= 0.012;
        if (sh.life <= 0 || sh.x < -200 || sh.x > width + 200) return false;

        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.dx * 12, sh.y - sh.dy * 12);
        grad.addColorStop(0, `rgba(${sh.color},${sh.life})`);
        grad.addColorStop(1, `rgba(${sh.color},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.dx * 12, sh.y - sh.dy * 12);
        ctx.stroke();
        return true;
      });

      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reduced, count, starScale, shootMin, shootMax, lensStrength, lensRadius, maxShooters]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
