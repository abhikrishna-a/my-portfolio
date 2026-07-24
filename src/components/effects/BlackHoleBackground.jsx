import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Component } from 'react';
import BlackHoleScene from './BlackHoleScene';
import useSmoothPointer from './useSmoothPointer';
import useReducedMotion from './useReducedMotion';

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('BlackHole R3F failed:', error);
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function FallbackPlane() {
  return null;
}

export default function BlackHoleBackground({ onFallback }) {
  const containerRef = useRef(null);
  const pointerRef = useSmoothPointer(containerRef);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const handleError = useCallback(() => {
    onFallback?.();
  }, [onFallback]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);

    function onVis() {
      setPaused(document.visibilityState === 'hidden');
    }
    document.addEventListener('visibilitychange', onVis);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ touchAction: 'pan-y' }}
    >
      <SceneErrorBoundary onError={handleError}>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 2 }}
          frameloop={paused ? 'never' : 'always'}
          style={{ background: '#030201' }}
        >
          <Suspense fallback={<FallbackPlane />}>
            <BlackHoleScene
              pointerRef={pointerRef}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
