import { useState, useEffect, useRef, useMemo, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import BackgroundScene from './BackgroundScene';
import BackgroundSceneSimple from './BackgroundSceneSimple';
import useReducedMotion from './useReducedMotion';
import { RenderContext } from './RenderControl';

/* ================================================================
   CSS-only fallback — enhanced space scene
   Used when no WebGL is available at all, before the canvas mounts,
   or while the WebGL context is lost
   ================================================================ */
function CSSFallback({ reduced }) {
  const nebulaRef = useRef(null);
  const outerGlowRef = useRef(null);
  const horizonRef = useRef(null);
  const diskRef = useRef(null);
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
        diskEl.style.background = `linear-gradient(to right, transparent 0%, rgba(120,35,8,${0.5 * breathe}) 6%, rgba(200,80,20,${0.7 * breathe}) 12%, rgba(255,157,58,${0.85 * breathe}) 17%, rgba(255,220,130,${0.95 * breathe}) 19%, rgba(255,236,180,${1.0 * breathe}) 20.3%, transparent 20.6%, transparent 79.4%, rgba(255,236,180,${1.0 * breathe}) 79.7%, rgba(255,220,130,${0.95 * breathe}) 81%, rgba(255,157,58,${0.85 * breathe}) 83%, rgba(200,80,20,${0.7 * breathe}) 88%, rgba(120,35,8,${0.5 * breathe}) 94%, transparent 100%)`;
        diskEl.style.boxShadow = `0 0 8px 2px rgba(255,157,58,${0.32 * breathe}), 0 0 22px 5px rgba(255,120,30,${0.14 * breathe})`;
      }
      if (arcUpperEl) {
        arcUpperEl.style.left = `calc(50% + ${drift}px)`;
        arcUpperEl.style.borderTopColor = `rgba(255,220,130,${0.7 * breathe})`;
        arcUpperEl.style.borderLeftColor = `rgba(255,170,50,${0.5 * breathe})`;
        arcUpperEl.style.borderRightColor = `rgba(255,170,50,${0.4 * breathe})`;
      }
      if (arcLowerEl) {
        arcLowerEl.style.left = `calc(50% + ${drift}px)`;
        arcLowerEl.style.borderBottomColor = `rgba(255,157,58,${0.4 * breathe})`;
        arcLowerEl.style.borderLeftColor = `rgba(200,80,20,${0.25 * breathe})`;
        arcLowerEl.style.borderRightColor = `rgba(200,80,20,${0.2 * breathe})`;
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
            width: '90px',
            height: '1px',
            opacity: 0,
            animation: `shootingStar ${duration}s linear ${delay}s infinite`,
          }}>
            <span style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)',
              borderRadius: '50%',
              transform: `rotate(${rotate}deg)`,
            }} />
          </div>
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
        width: 'min(38vmin, 264px)',
        height: 'min(38vmin, 264px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: '#000',
        border: '1px solid rgba(255,200,120,0.55)',
        boxShadow: '0 0 28px 6px rgba(255,140,40,0.2), inset 0 0 40px 12px rgba(0,0,0,0.9)',
        zIndex: 2,
      }} />

      <div ref={arcUpperRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(40vmin, 280px)',
        height: 'min(40vmin, 280px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: 'rgba(255,220,130,0.7)',
        borderLeftColor: 'rgba(255,170,50,0.5)',
        borderRightColor: 'rgba(255,170,50,0.4)',
        borderBottomColor: 'transparent',
        zIndex: 3,
      }} />

      <div ref={arcLowerRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(40vmin, 280px)',
        height: 'min(40vmin, 280px)',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1.5px solid transparent',
        borderBottomColor: 'rgba(255,157,58,0.4)',
        borderLeftColor: 'rgba(200,80,20,0.25)',
        borderRightColor: 'rgba(200,80,20,0.2)',
        borderTopColor: 'transparent',
        zIndex: 3,
      }} />

      <div ref={diskRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'min(64vmin, 450px)',
        height: '3px',
        transform: 'translate(-50%, -50%) rotate(0deg)',
        zIndex: 4,
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
   Auto-tier profile — pick the rendering tier from device class.

   tier 'full'   → GLSL raymarcher (desktop + capable phones)
   tier 'simple' → Three.js particle scene (mid/weak phones,
                   reduced-motion users)
   tier 'css'    → CSS-only fallback (no/software WebGL, ≤2 cores)
   ================================================================ */
function detectProfile(reduced) {
  const forcedTier =
    typeof location !== 'undefined'
      ? new URLSearchParams(location.search).get('tier')
      : null;
  const mobile =
    typeof navigator !== 'undefined' &&
    'maxTouchPoints' in navigator &&
    navigator.maxTouchPoints > 0;
  const cores =
    (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
  const mem =
    (typeof navigator !== 'undefined' && navigator.deviceMemory) || (mobile ? 2 : 8);

  if (forcedTier === 'css' || forcedTier === 'simple' || forcedTier === 'full') {
    return {
      mobile,
      cores,
      mem,
      weak: cores <= 4 && mem <= 4,
      tier: forcedTier,
      forced: true,
    };
  }

  const hasGL = detectWebGL();

  const profile = { mobile, cores, mem };

  if (!hasGL) { profile.tier = 'css'; return profile; }
  if (cores <= 2) { profile.tier = 'css'; return profile; }
  if (reduced) { profile.tier = 'simple'; return profile; }
  if (mobile) {
    if (cores <= 4 || mem <= 4) { profile.tier = 'simple'; return profile; }
    profile.tier = 'full';
    profile.weak = false;
    return profile;
  }
  profile.tier = 'full';
  profile.weak = cores <= 4 && mem <= 4;
  return profile;
}

/* per-profile render params — DPR, shader step ceiling, frame cap,
   and post-processing quality/resolution for the active tier */
function profileParams(profile, tier) {
  const { mobile, weak } = profile;
  if (tier === 'css') {
    return { dpr: 1, maxSteps: 64, frameCap: false, postQuality: 'reduced', resolutionScale: 1 };
  }
  if (tier === 'simple') {
    const dpr = mobile ? (profile.cores <= 3 ? 0.85 : 0.9) : 1.25;
    return { dpr, maxSteps: 64, frameCap: true, postQuality: 'reduced', resolutionScale: 0.75 };
  }
  if (mobile) {
    return { dpr: 1.0, maxSteps: 128, frameCap: false, postQuality: 'full', resolutionScale: 1 };
  }
  if (weak) {
    return { dpr: 1.25, maxSteps: 128, frameCap: true, postQuality: 'full', resolutionScale: 0.75 };
  }
  return { dpr: 1.5, maxSteps: 256, frameCap: false, postQuality: 'full', resolutionScale: 1 };
}

/* ================================================================
   Main orchestrator — 3-tier progressive rendering
   Tier 1: GLSL raymarcher (desktop WebGL2)
   Tier 2: Simple Three.js (mobile/basic WebGL)
   Tier 3: CSS fallback (no WebGL)

   Render-loop control is consolidated into a single boolean:
     shouldRender = isIntersecting && !documentHidden && !contextLost
   — driven through one setFrameloop call inside the canvas.
   ================================================================ */
function BlackHoleHeroInner() {
  const reduced = useReducedMotion();
  const containerRef = useRef(null);

  const [everMounted, setEverMounted] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  const profile = useRef(detectProfile(reduced));
  const [tier, setTier] = useState(() => profile.current.tier);
  const downgradedRef = useRef(false);
  const params = useMemo(() => profileParams(profile.current, tier), [tier]);

  const debugMode = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const v = parseInt(new URLSearchParams(window.location.search).get('debug') || '0', 10);
    return Number.isNaN(v) ? 0 : v;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) setEverMounted(true);
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setDocumentHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  /* WebGL context loss → pause + show CSS fallback;
     restore → force full remount of the Canvas */
  useEffect(() => {
    const onLost = () => setContextLost(true);
    const onRestored = () => {
      setContextLost(false);
      setCanvasKey((k) => k + 1);
    };
    window.addEventListener('bh:context-lost', onLost);
    window.addEventListener('bh:context-restored', onRestored);
    return () => {
      window.removeEventListener('bh:context-lost', onLost);
      window.removeEventListener('bh:context-restored', onRestored);
    };
  }, []);

  /* Mobile Safari can lose the context and never fire
     webglcontextrestored. If the context is still lost when the tab
     becomes visible again, force the remount after 3s anyway. */
  useEffect(() => {
    if (!contextLost || documentHidden) return;
    const timer = setTimeout(() => {
      setContextLost(false);
      setCanvasKey((k) => k + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [contextLost, documentHidden]);

  /* Auto-tier downgrade — if the raymarcher watchdog reports it is
     pinned at minimum quality and still too slow, drop to the simple
     particle tier once instead of letting the page stay janky. */
  useEffect(() => {
    const onTooSlow = () => {
      if (profile.current.tier !== 'full' || downgradedRef.current) return;
      downgradedRef.current = true;
      setTier('simple');
    };
    window.addEventListener('bh:too-slow', onTooSlow);
    return () => window.removeEventListener('bh:too-slow', onTooSlow);
  }, []);

  const shouldRender = isIntersecting && !documentHidden && !contextLost;
  const renderCtx = useMemo(() => ({ shouldRender }), [shouldRender]);
  const dpr = reduced ? 1 : params.dpr;

  const cssFallback = <CSSFallback reduced={reduced} />;
  const simpleFallback = (
    <Canvas
      key={`simple-${canvasKey}`}
      dpr={dpr}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', toneMappingExposure: 1.2 }}
      camera={{ position: [0, 2.6, 6.8], fov: 55, near: 0.1, far: 200 }}
      style={{ background: '#020202' }}
    >
      <Suspense fallback={null}>
        <BackgroundSceneSimple reduced={reduced} frameCap={params.frameCap} />
      </Suspense>
    </Canvas>
  );
  const fullScene = (
    <Canvas
      key={`full-${canvasKey}`}
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0.7, 2.5, 3.7], fov: 55, near: 0.1, far: 200 }}
      style={{ background: '#020202' }}
    >
      <Suspense fallback={null}>
        <BackgroundScene
          reduced={reduced}
          mobile={profile.current.mobile}
          maxSteps={params.maxSteps}
          frameCap={params.frameCap}
          postQuality={params.postQuality}
          resolutionScale={params.resolutionScale}
          debugMode={debugMode}
        />
      </Suspense>
    </Canvas>
  );

  /* tier 'css' → pure CSS fallback, zero GPU cost */
  if (tier === 'css') {
    return (
      <div ref={containerRef} className="absolute inset-0">
        {cssFallback}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      {!everMounted ? (
        cssFallback
      ) : (
        <>
          {contextLost && (
            <div className="absolute inset-0" style={{ zIndex: 10 }}>
              {cssFallback}
            </div>
          )}
          <RenderContext.Provider value={renderCtx}>
            {tier === 'simple' ? (
              /* simple tier (or runtime downgrade from full) → particles */
              <ErrorBoundary fallback={cssFallback}>
                {simpleFallback}
              </ErrorBoundary>
            ) : (
              /* full tier → GLSL raymarcher */
              <ErrorBoundary fallback={cssFallback}>
                {/* inner boundary: if GLSL raymarcher fails → simple Three.js */}
                <ErrorBoundary fallback={simpleFallback}>
                  {fullScene}
                </ErrorBoundary>
              </ErrorBoundary>
            )}
          </RenderContext.Provider>
        </>
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
