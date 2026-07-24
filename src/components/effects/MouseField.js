import { useRef, useCallback, useEffect } from 'react';

/**
 * Framerate-independent spring cursor + rolling trail buffer for vortex displacement.
 *
 * Returns:
 *   data        – React ref: { x, y, vx, vy, targetX, targetY }
 *   update(dt)  – call every frame in rAF
 *   trailArray  – Float32Array(64) = 16 points × {x, y, age, strength}
 *                 ready to write directly into a vec4[16] uniform
 *   trailCount  – React ref: number of active trail points
 */
export default function MouseField({
  springK = 4,
  trailLength = 16,
  velocityThreshold = 0.3,
  ageSpeed = 0.55,
  strengthDecay = 0.96,
  idleThreshold = 2000,
  idlePullK = 2,
} = {}) {
  const data = useRef({
    x: 0, y: 0,
    vx: 0, vy: 0,
    targetX: 0, targetY: 0,
  });

  const trailBuffer = useRef(new Float32Array(trailLength * 4));
  const trailCount = useRef(0);
  const trailHead = useRef(0);
  const lastMoveTime = useRef(0);
  const reduced = useRef(false);

  const onPointerMove = useCallback((e) => {
    if (reduced.current) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const d = data.current;
    d.targetX = (cx / window.innerWidth) * 2 - 1;
    d.targetY = -(cy / window.innerHeight) * 2 + 1;
    lastMoveTime.current = performance.now();
  }, []);

  const update = useCallback((dt) => {
    const d = data.current;
    const buf = trailBuffer.current;

    /* ── spring-eased position ── */
    const k = 1 - Math.exp(-springK * dt);
    const prevX = d.x;
    const prevY = d.y;
    d.x += (d.targetX - d.x) * k;
    d.y += (d.targetY - d.y) * k;
    d.vx = (d.x - prevX) / Math.max(dt, 1e-4);
    d.vy = (d.y - prevY) / Math.max(dt, 1e-4);

    /* ── idle ease-back to center ── */
    if (performance.now() - lastMoveTime.current > idleThreshold) {
      const pull = 1 - Math.exp(-idlePullK * dt);
      d.targetX *= 1 - pull;
      d.targetY *= 1 - pull;
    }

    /* ── sample new trail point if velocity exceeds threshold ── */
    const vel = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
    if (vel > velocityThreshold) {
      const idx = trailHead.current;
      const base = idx * 4;
      buf[base]     = d.x;
      buf[base + 1] = d.y;
      buf[base + 2] = 0;      // age starts at 0
      buf[base + 3] = Math.min(vel * 0.4, 0.9); // strength
      trailHead.current = (idx + 1) % trailLength;
      if (trailCount.current < trailLength) trailCount.current++;
    }

    /* ── age + decay all active trail points ── */
    let alive = 0;
    for (let i = 0; i < trailLength; i++) {
      const base = i * 4;
      const age = buf[base + 2];
      if (age < 0) continue; // inactive slot
      buf[base + 2] = age + dt * ageSpeed;
      buf[base + 3] *= strengthDecay;
      if (buf[base + 2] >= 1.0 || buf[base + 3] < 0.01) {
        buf[base + 2] = -1; // mark inactive
        buf[base + 3] = 0;
      } else {
        alive++;
      }
    }
    trailCount.current = alive;
  }, [springK, velocityThreshold, ageSpeed, strengthDecay, idleThreshold, idlePullK, trailLength]);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) reduced.current = true;
    const handler = (e) => { reduced.current = e.matches; };
    mq?.addEventListener('change', handler);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    return () => {
      mq?.removeEventListener('change', handler);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
    };
  }, [onPointerMove]);

  return { data, update, trailArray: trailBuffer, trailCount };
}
