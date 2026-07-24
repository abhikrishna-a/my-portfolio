import { useRef, useState, useEffect, useMemo, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import EmberSilkScene from './EmberSilkScene';
import usePointerFluid from './usePointerFluid';
import useReducedMotion from './useReducedMotion';
import useDeviceCapability from './useDeviceCapability';

const DPR_CAP = 2;

function resolveQuality(requested, deviceQuality) {
  if (requested === 'high') return 1.0;
  if (requested === 'low') return 0.3;
  return deviceQuality === 'low' ? 0.3 : 1.0;
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('EmberSilk scene error:', err);
    if (this.props.onError) this.props.onError();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export default function EmberSilkBackground({
  ambientSpeed = 0.02,
  interactionStrength = 1.0,
  interactionRadius = 0.12,
  grainAmount = 0.02,
  quality = 'auto',
  onFallback,
}) {
  const containerRef = useRef(null);
  const pointerRef = usePointerFluid(containerRef);
  const reducedMotion = useReducedMotion();
  const deviceCap = useDeviceCapability();
  const [sceneFailed, setSceneFailed] = useState(false);

  const qualityValue = useMemo(
    () => resolveQuality(quality, deviceCap.quality),
    [quality, deviceCap.quality]
  );

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'hidden') setVisible(false);
      else {
        const el = containerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const inView = rect.bottom > 0 && rect.top < window.innerHeight;
          if (inView) setVisible(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const handleSceneError = () => {
    setSceneFailed(true);
    if (onFallback) onFallback();
  };

  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

  if (reducedMotion || sceneFailed) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(120% 100% at 50% 30%, #1a0a03 0%, #000000 70%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
        }}
        dpr={dpr}
        camera={{ position: [0, 0, 1], fov: 90, near: 0.1, far: 10 }}
        frameloop={visible ? 'always' : 'never'}
        style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0);
        }}
      >
        <SceneErrorBoundary onError={handleSceneError}>
          <Suspense fallback={null}>
            <EmberSilkScene
              pointerRef={pointerRef}
              reducedMotion={reducedMotion}
              ambientSpeed={ambientSpeed}
              interactionStrength={interactionStrength}
              interactionRadius={interactionRadius}
              grainAmount={grainAmount}
              quality={qualityValue}
            />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
    </div>
  );
}
