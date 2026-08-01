import { useEffect, useRef, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import { RenderContext } from './RenderControl';

/* ================================================================
   FrameGovernor — caps the GPU render rate on weak devices.

   Takes over the R3F loop: sets frameloop to 'never' and manually
   advances frames at `fps` via the store's advance(). Halves (or
   better) the per-second GPU cost on low-end devices while the
   CSS overlay / hero text keeps running at full 60fps.

   Play is paused whenever RenderContext.shouldRender is false
   (off-screen or hidden tab) — zero GPU cost, same as RenderGuard.
   ================================================================ */

export default function FrameGovernor({ fps = 30 }) {
  const { shouldRender } = useContext(RenderContext);
  const advance = useThree((state) => state.advance);
  const setFrameloop = useThree((state) => state.setFrameloop);

  useEffect(() => {
    if (fps >= 60) return;

    setFrameloop('never');

    let raf;
    const interval = 1000 / fps;
    let last = 0;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!shouldRender) return;
      if (now - last >= interval) {
        last = now;
        advance(now);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      setFrameloop('always');
    };
  }, [fps, shouldRender, advance, setFrameloop]);

  return null;
}
