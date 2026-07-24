import { useState, Component } from 'react';
import BlackHoleBackground from './BlackHoleBackground';
import useDeviceCapability from './useDeviceCapability';

/* CSS-only fallback — matches the demo's .void-core look */
function CSSFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #150c05 0%, #050301 45%, #000 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '340px',
          height: '340px',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, #000 0%, #000 38%, rgba(255,140,40,0.55) 40%, rgba(255,157,58,0.15) 55%, transparent 70%)',
          filter: 'blur(2px)',
          animation: 'spinCore 90s linear infinite',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-60px',
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,157,58,0.35) 40deg, transparent 90deg, transparent 200deg, rgba(255,157,58,0.25) 250deg, transparent 300deg)',
            animation: 'spinFlare 40s linear infinite reverse',
            filter: 'blur(8px)',
          }}
        />
      </div>
      <style>{`
        @keyframes spinCore { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes spinFlare { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('BlackHole WebGL failed, falling back to CSS:', error);
  }
  render() {
    if (this.state.hasError) {
      return <CSSFallback />;
    }
    return this.props.children;
  }
}

export default function HeroBackground() {
  const { webgl2 } = useDeviceCapability();
  const [fallback, setFallback] = useState(false);

  if (!webgl2 || fallback) {
    return (
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <CSSFallback />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <WebGLErrorBoundary>
        <BlackHoleBackground onFallback={() => setFallback(true)} />
      </WebGLErrorBoundary>
    </div>
  );
}
