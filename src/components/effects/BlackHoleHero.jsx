import { useState, useEffect, useRef, useMemo, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import BackgroundScene from './BackgroundScene';
import BackgroundSceneSimple from './BackgroundSceneSimple';
import useReducedMotion from './useReducedMotion';

/* ================================================================
   CSS-only fallback — enhanced space scene
   Used when no WebGL is available at all
   ================================================================ */
function CSSFallback({ reduced }) {
  const nebulaRef = useRef(null);
  const outerGlowRef = useRef(null);
  const horizonRef = useRef(null);
  const diskRef = useRef(null);
  const planetRef = useRef(null);
  const arcUpperRef = useRef(null);
  const arcLowerRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    let raf;
    let start = performance.now();

    const nebulaEl = nebulaRef.current;
    const outerEl = outerGlowRef.current;
    const horizonEl = horizonRef.current;
    const diskEl = diskRef.current;
    const planetEl = planetRef.current;
    const arcUpperEl = arcUpperRef.current;
    const arcLowerEl = arcLowerRef.current;

    function tick(now) {
      const t = (now - start) * 0.001;
      const breathe = 0.9 + Math.sin(t * 0.4) * 0.1;
      const drift = Math.sin(t * 0.1) * 0.3;

      if (nebulaEl) nebulaEl.style.left = `calc(50% + ${drift * 0.5}px)`;
      if (outerEl) {
        outerEl.style.left = `calc(50% + ${drift}px)`;
        outerEl.style.background = `radial-gradient(circle, rgba(255,157,58,${0.06 * breathe}) 0%, transparent 70%)`;
      }
      if (horizonEl) horizonEl.style.left = `calc(50% + ${drift}px)`;
      if (diskEl) {
        diskEl.style.transform = `translate(-50%, -50%) rotate(${drift * 0.15}deg)`;
        diskEl.style.background = `linear-gradient(to right, transparent 0%, rgba(120,35,8,${0.5 * breathe}) 8%, rgba(200,80,20,${0.8 * breathe}) 18%, rgba(255,157,58,${0.95 * breathe}) 30%, rgba(255,200,100,${1.0 * breathe}) 42%, rgba(255,250,240,${1.0 * breathe}) 48%, transparent 50%, rgba(255,250,240,${1.0 * breathe}) 52%, rgba(255,200,100,${1.0 * breathe}) 58%, rgba(255,157,58,${0.95 * breathe}) 70%, rgba(200,80,20,${0.7 * breathe}) 82%, rgba(120,35,8,${0.4 * breathe}) 92%, transparent 100%)`;
        diskEl.style.boxShadow = `0 0 8px 2px rgba(255,157,58,${0.3 * breathe}), 0 0 20px 4px rgba(255,120,30,${0.12 * breathe})`;
      }
      if (planetEl) planetEl.style.left = `calc(22% + ${drift * 0.3}px)`;
      if (arcUpperEl) {
        arcUpperEl.style.left = `calc(50% + ${drift}px)`;
        arcUpperEl.style.borderTopColor = `rgba(255,220,130,${0.85 * breathe})`;
        arcUpperEl.style.borderLeftColor = `rgba(255,170,50,${0.45 * breathe})`;
        arcUpperEl.style.borderRightColor = `rgba(255,170,50,${0.45 * breathe})`;
      }
      if (arcLowerEl) {
        arcLowerEl.style.left = `calc(50% + ${drift}px)`;
        arcLowerEl.style.borderBottomColor = `rgba(255,157,58,${0.35 * breathe})`;
        arcLowerEl.style.borderLeftColor = `rgba(200,80,20,${0.15 * breathe})`;
        arcLowerEl.style.borderRightColor = `rgba(200,80,20,${0.15 * breathe})`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const stars = useMemo(() => {
    const result = [];
    for (let i = 0; i < 35; i++) {
      const x = ((i * 37 + 13) % 97);
      const y = ((i * 53 + 7) % 89);
      const s = 0.8 + (i % 5) * 0.5;
      const o = 0.15 + (i % 6) * 0.12;
      const colorType = i % 5;
      let bg;
      if (colorType === 0) bg = `rgba(255,200,140,${o})`;
      else if (colorType === 1) bg = `rgba(200,220,255,${o})`;
      else bg = `rgba(255,255,255,${o})`;
      result.push(
        <div key={`s${i}`} style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: `${s}px`,
          height: `${s}px`,
          borderRadius: '50%',
          background: bg,
        }} />
      );
    }
    return result;
  }, []);

  return (
    <div className="absolute inset-0" style={{ background: '#020202', overflow: 'hidden' }}>
      <div>{stars}</div>

      {[0, 1, 2].map((i) => {
        const top = 8 + i * 25;
        const left = -10 + i * 15;
        const delay = i * 3.5;
        const duration = 2.5 + i * 0.8;
        const rotate = -30 - i * 5;
        return (
          <div key={`comet${i}`} style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)',
            borderRadius: '50%',
            transform: `rotate(${rotate}deg)`,
            animation: `shootingStar ${duration}s linear ${delay}s infinite`,
            opacity: 0,
          }} />
        );
      })}

      <div ref={nebulaRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(70vmin, 500px)',
        height: 'min(70vmin, 500px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(230,126,34,0.04) 0%, rgba(180,80,20,0.02) 40%, transparent 70%)',
        filter: 'blur(30px)',
      }} />

      <div ref={outerGlowRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(44vmin, 310px)',
        height: 'min(44vmin, 310px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,157,58,0.06) 0%, transparent 70%)',
      }} />

      <div ref={horizonRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(28vmin, 195px)',
        height: 'min(28vmin, 195px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: '#000',
        zIndex: 2,
      }} />

      <div ref={arcUpperRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(30vmin, 210px)',
        height: 'min(30vmin, 210px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: 'rgba(255,220,130,0.85)',
        borderLeftColor: 'rgba(255,170,50,0.45)',
        borderRightColor: 'rgba(255,170,50,0.45)',
        borderBottomColor: 'transparent',
        zIndex: 3,
      }} />

      <div ref={arcLowerRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(30vmin, 210px)',
        height: 'min(30vmin, 210px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1.5px solid transparent',
        borderBottomColor: 'rgba(255,157,58,0.35)',
        borderLeftColor: 'rgba(200,80,20,0.15)',
        borderRightColor: 'rgba(200,80,20,0.15)',
        borderTopColor: 'transparent',
        zIndex: 3,
      }} />

      <div ref={diskRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(68vmin, 480px)',
        height: '3px',
        transform: 'translate(-50%, -50%) rotate(0deg)',
        zIndex: 4,
      }} />

      <div ref={planetRef} style={{
        position: 'absolute',
        top: 'calc(50% + 1px)',
        left: '22%',
        width: 'min(3.5vmin, 24px)',
        height: 'min(3.5vmin, 24px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 60% 40%, #151520 0%, #0a0a10 60%, #050508 100%)',
        boxShadow: 'inset -2px -1px 4px rgba(0,0,0,0.8), 0 0 4px 1px rgba(0,0,0,0.5)',
        zIndex: 5,
      }} />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to top, rgba(230,126,34,0.05), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ================================================================
   Error boundary — catches render errors, shows fallback
   ================================================================ */
class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) {
    console.warn('[BlackHole] render failed — falling back:', e);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ================================================================
   Capability detection — proactive WebGL check
   ================================================================ */
function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL);
      if (/SwiftShader|llvmpipe|Software|Google SwiftShader/i.test(renderer)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/* ================================================================
   Main orchestrator — 3-tier progressive rendering
   Tier 1: GLSL raymarcher (desktop WebGL2)
   Tier 2: Simple Three.js (mobile/basic WebGL)
   Tier 3: CSS fallback (no WebGL)
   ================================================================ */
function BlackHoleHeroInner() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const containerRef = useRef(null);
  const hasWebGL = useRef(detectWebGL());
  const dpr = reduced ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cssFallback = <CSSFallback reduced={reduced} />;
  const simpleFallback = (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 3, 7], fov: 55, near: 0.1, far: 200 }}
      style={{ background: '#020202' }}
    >
      <Suspense fallback={null}>
        <BackgroundSceneSimple reduced={reduced} />
      </Suspense>
    </Canvas>
  );

  /* no WebGL at all → CSS fallback */
  if (!hasWebGL.current) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        {cssFallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      {visible ? (
        /* outer boundary: if simple Three.js also fails → CSS */
        <ErrorBoundary fallback={cssFallback}>
          {/* inner boundary: if GLSL raymarcher fails → simple Three.js */}
          <ErrorBoundary fallback={simpleFallback}>
            <Canvas
              dpr={dpr}
              gl={{
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              camera={{ position: [0, 0, 9.0], fov: 50, near: 0.1, far: 200 }}
              style={{ background: '#020202' }}
            >
              <Suspense fallback={null}>
                <BackgroundScene reduced={reduced} />
              </Suspense>
            </Canvas>
          </ErrorBoundary>
        </ErrorBoundary>
      ) : (
        cssFallback
      )}
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
