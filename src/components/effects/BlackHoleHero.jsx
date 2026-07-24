import { useState, useEffect, useRef, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import BackgroundScene from './BackgroundScene';
import MouseField from './MouseField';
import useReducedMotion from './useReducedMotion';

/* ── CSS-only fallback when WebGL is unavailable ── */
function CSSFallback({ reduced }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let raf;
    let start = performance.now();
    function tick(now) {
      setPulse((now - start) * 0.001);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const drift = reduced ? 0 : Math.sin(pulse * 0.15) * 2;
  const glow  = reduced ? 0.6 : 0.5 + Math.sin(pulse * 0.3) * 0.15;

  return (
    <div className="absolute inset-0" style={{ background: '#030201' }}>
      {/* Outer radial glow — amber/orange halo */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 42% 42% at ${50 + drift}% 48%,
            rgba(255,157,58,${0.18 * glow}) 0%,
            rgba(140,46,10,${0.08 * glow}) 40%,
            rgba(3,2,1,0) 70%
          )`,
          transition: 'none',
        }}
      />
      {/* Photon ring — thin bright ring */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle at ${50 + drift}% 48%,
            transparent 18%,
            rgba(255,210,120,${0.12 * glow}) 20%,
            transparent 22%
          )`,
        }}
      />
      {/* Disk streak — horizontal line through center */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 46%,
            rgba(255,157,58,${0.06 * glow}) 48%,
            rgba(255,250,240,${0.08 * glow}) 50%,
            rgba(255,157,58,${0.06 * glow}) 52%,
            transparent 54%
          )`,
        }}
      />
    </div>
  );
}

/* ── Error boundary ── */
class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) {
    console.warn('[BlackHole] render failed — falling back to CSS:', e);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ── Main orchestrator ── */
function BlackHoleHeroInner() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const mouse = MouseField({ springK: 4, trailLength: 16 });
  const containerRef = useRef(null);

  /* IntersectionObserver — pause when off-screen */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* rAF loop — update mouse trail every frame */
  useEffect(() => {
    if (!visible) return;
    let raf;
    let last = performance.now();
    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      mouse.update(dt);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, mouse]);

  const fallback = <CSSFallback reduced={reduced} />;

  return (
    <div ref={containerRef} className="absolute inset-0">
      <ErrorBoundary fallback={fallback}>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 5.6], fov: 50, near: 0.1, far: 100 }}
          style={{ background: '#030201' }}
        >
          <Suspense fallback={null}>
            <BackgroundScene mouse={mouse} reduced={reduced} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

export default function BlackHoleHero(props) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <BlackHoleHeroInner {...props} />
    </div>
  );
}
