import { useRef, useEffect } from 'react';

const RAMP = [
  { t: 0.00, c: [92, 29, 0] },
  { t: 0.32, c: [255, 122, 26] },
  { t: 0.68, c: [255, 179, 71] },
  { t: 1.00, c: [255, 233, 199] },
];

function rampColor(t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < RAMP.length - 1; i++) {
    const a = RAMP[i], b = RAMP[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t);
      return [
        a.c[0] + (b.c[0] - a.c[0]) * f,
        a.c[1] + (b.c[1] - a.c[1]) * f,
        a.c[2] + (b.c[2] - a.c[2]) * f,
      ];
    }
  }
  return RAMP[RAMP.length - 1].c;
}

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function noise2(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const n00 = hash(xi, yi), n10 = hash(xi + 1, yi);
  const n01 = hash(xi, yi + 1), n11 = hash(xi + 1, yi + 1);
  return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v;
}

function curl(x, y, t) {
  const e = 0.0009;
  const n1 = noise2(x, y + e + t);
  const n2 = noise2(x, y - e + t);
  const n3 = noise2(x + e, y + t);
  const n4 = noise2(x - e, y + t);
  return [(n1 - n2) / (2 * e), (n4 - n3) / (2 * e)];
}

const FIELD_SCALE = 0.0021;
const REPEL_RADIUS = 160;
const REPEL_STRENGTH = 3.2;
const RIBBON_COUNT = 7;
const RIBBON_LEN = 28;

function initRibbon(r, W, H) {
  r.homeX = W * 0.5 + (Math.random() - 0.5) * W * 0.55;
  r.homeY = H * 0.5 + (Math.random() - 0.5) * H * 0.55;
  r.hx = r.homeX;
  r.hy = r.homeY;
  r.pts = [];
  for (let i = 0; i < RIBBON_LEN; i++) r.pts.push({ x: r.hx, y: r.hy });
  r.hue = Math.random();
  r.width = 10 + Math.random() * 22;
  r.phase = Math.random() * Math.PI * 2;
}

function spawnDust(p, W, H) {
  p.x = Math.random() * W;
  p.y = Math.random() * H;
  p.life = 0;
  p.maxLife = 420 + Math.random() * 420;
  p.size = 0.5 + Math.random() * 1.4;
  p.baseT = Math.random();
  p.vx = 0;
  p.vy = 0;
  p.twinklePhase = Math.random() * Math.PI * 2;
  p.twinkleSpeed = 0.03 + Math.random() * 0.05;
}

export default function EmberSilk() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H, DPR;
    let animId;
    let t = 0;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = '#050302';
      ctx.fillRect(0, 0, W, H);
    }
    window.addEventListener('resize', resize);
    resize();

    const ribbons = [];
    for (let i = 0; i < RIBBON_COUNT; i++) {
      const r = {};
      initRibbon(r, W, H);
      ribbons.push(r);
    }

    const dustCount = Math.round(Math.min(1200, (W * H) / 1200));
    const dust = [];
    for (let i = 0; i < dustCount; i++) {
      const p = {};
      spawnDust(p, W, H);
      p.life = Math.random() * p.maxLife;
      dust.push(p);
    }

    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    function setPointer(x, y) {
      mouse.vx = x - mouse.x;
      mouse.vy = y - mouse.y;
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;
    }
    const onMove = (e) => setPointer(e.clientX, e.clientY);
    const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; };
    const onTouchMove = (e) => { if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd = () => { mouse.active = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    function updateRibbon(r) {
      const [fx, fy] = curl(r.homeX * FIELD_SCALE, r.homeY * FIELD_SCALE, t * 0.25 + r.phase);
      const swayX = r.homeX + fx * 12;
      const swayY = r.homeY + fy * 12;
      r.hx += (swayX - r.hx) * 0.08;
      r.hy += (swayY - r.hy) * 0.08;

      if (mouse.active) {
        const dx = r.hx - mouse.x, dy = r.hy - mouse.y;
        const d2 = dx * dx + dy * dy;
        const rr = REPEL_RADIUS * 1.6, r2 = rr * rr;
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / rr) * REPEL_STRENGTH * 0.9;
          r.hx += (dx / d) * force * 2;
          r.hy += (dy / d) * force * 2;
        }
      }

      r.pts.pop();
      r.pts.unshift({ x: r.hx, y: r.hy });
    }

    function drawRibbon(r) {
      const pts = r.pts;
      for (let i = 0; i < pts.length - 1; i++) {
        const tt = i / pts.length;
        const width = r.width * (1 - tt) * (0.5 + 0.5 * Math.sin(i * 0.4 + t * 2));
        const alpha = (1 - tt) * 0.05;
        if (width <= 0.4) continue;
        const [rr, gg, bb] = rampColor(0.25 + 0.6 * (1 - tt) + 0.15 * r.hue);
        ctx.strokeStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
        ctx.stroke();
      }
    }

    function frame() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(5,3,2,0.12)';
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'lighter';
      t += 0.0016;

      for (let i = 0; i < ribbons.length; i++) {
        updateRibbon(ribbons[i]);
        drawRibbon(ribbons[i]);
      }

      for (let i = 0; i < dust.length; i++) {
        const p = dust[i];
        const [fx, fy] = curl(p.x * FIELD_SCALE, p.y * FIELD_SCALE, t);
        p.vx += fx * 0.06;
        p.vy += fy * 0.06 + 0.003;
        p.twinklePhase += p.twinkleSpeed;

        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy, r2 = REPEL_RADIUS * REPEL_RADIUS;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
            p.vx += mouse.vx * 0.02;
            p.vy += mouse.vy * 0.02;
          }
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20 || p.life > p.maxLife) {
          spawnDust(p, W, H);
          continue;
        }

        const lifeT = p.life / p.maxLife;
        const fade = Math.sin(lifeT * Math.PI);
        const twinkle = 0.55 + 0.45 * Math.sin(p.twinklePhase);
        const speedMag = Math.min(1, Math.hypot(p.vx, p.vy) / 3);
        const colorT = Math.min(1, p.baseT * 0.6 + speedMag * 0.4);
        const [rr, gg, bb] = rampColor(colorT);
        const alpha = 0.25 * fade * twinkle;
        const rad = p.size * (0.6 + speedMag * 0.3);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3);
        grad.addColorStop(0, `rgba(${rr | 0},${gg | 0},${bb | 0},${alpha})`);
        grad.addColorStop(1, `rgba(${rr | 0},${gg | 0},${bb | 0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(120% 100% at 50% 30%, #35130a 0%, #050302 70%)' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
