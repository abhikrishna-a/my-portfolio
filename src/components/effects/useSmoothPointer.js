import { useRef, useEffect } from 'react';

const LERP = 0.08;
const VELOCITY_LERP = 0.15;
const ACTIVE_DECAY = 0.6;

export default function useSmoothPointer(containerRef) {
  const dataRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    prevX: 0.5,
    prevY: 0.5,
    vx: 0,
    vy: 0,
    speed: 0,
    active: 0,
    lastMoveTime: 0,
    rect: { left: 0, top: 0, width: 1, height: 1 },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;
    let running = true;

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
      d.targetX = (e.clientX - left) / width;
      d.targetY = (e.clientY - top) / height;
      d.active = 1.0;
      d.lastMoveTime = performance.now() / 1000;
    }

    function onPointerLeave() {
      dataRef.current.active = 0;
    }

    function tick() {
      if (!running) return;
      const d = dataRef.current;
      const now = performance.now() / 1000;

      /* smooth position toward target */
      d.prevX = d.x;
      d.prevY = d.y;
      d.x += (d.targetX - d.x) * LERP;
      d.y += (d.targetY - d.y) * LERP;

      /* velocity = frame delta (negative Y for screen→GL) */
      const rawVx = (d.x - d.prevX) * 60;
      const rawVy = -(d.y - d.prevY) * 60;
      d.vx += (rawVx - d.vx) * VELOCITY_LERP;
      d.vy += (rawVy - d.vy) * VELOCITY_LERP;
      d.speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);

      /* decay active when idle */
      const idle = now - d.lastMoveTime;
      if (idle > 0.8) {
        d.active += (0 - d.active) * ACTIVE_DECAY * 0.016;
        if (d.active < 0.01) d.active = 0;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [containerRef]);

  return dataRef;
}
