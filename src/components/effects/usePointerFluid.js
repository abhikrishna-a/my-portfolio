import { useRef, useEffect } from 'react';

const TRAIL_LENGTH = 24;
const EMA_ALPHA = 0.15;
const FADE_SPEED = 2.0;

export default function usePointerFluid(containerRef) {
  const dataRef = useRef({
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    speed: 0,
    active: 0,
    lastMoveTime: 0,
    smoothVx: 0,
    smoothVy: 0,
    trail: Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0.5, y: 0.5, age: 999 })),
    trailCursor: 0,
    rect: { left: 0, top: 0, width: 1, height: 1 },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateRect() {
      const r = container.getBoundingClientRect();
      dataRef.current.rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }

    const ro = new ResizeObserver(updateRect);
    ro.observe(container);
    updateRect();

    function onPointerMove(e) {
      const d = dataRef.current;
      const { left, top, width, height } = d.rect;
      const nx = (e.clientX - left) / width;
      const ny = 1.0 - (e.clientY - top) / height;

      const now = performance.now() / 1000;
      const dt = Math.max(now - (d.lastMoveTime || now), 0.001);

      const rawVx = (nx - d.x) / dt;
      const rawVy = (ny - d.y) / dt;

      d.smoothVx += (rawVx - d.smoothVx) * EMA_ALPHA;
      d.smoothVy += (rawVy - d.smoothVy) * EMA_ALPHA;

      d.x = nx;
      d.y = ny;
      d.vx = d.smoothVx;
      d.vy = d.smoothVy;
      d.speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      d.active = 1.0;
      d.lastMoveTime = now;

      d.trail[d.trailCursor] = { x: nx, y: ny, age: 0 };
      d.trailCursor = (d.trailCursor + 1) % TRAIL_LENGTH;
    }

    function onPointerLeave() {
      dataRef.current.active = 0;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [containerRef]);

  return dataRef;
}

export { TRAIL_LENGTH, FADE_SPEED };
