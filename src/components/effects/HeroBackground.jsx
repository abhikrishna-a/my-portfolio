import { useState, Component } from 'react';
import EmberSilkBackground from './EmberSilkBackground';
import EmberSilkFallback from './EmberSilkFallback';
import useDeviceCapability from './useDeviceCapability';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('EmberSilk WebGL failed, falling back to Canvas2D:', error);
  }
  render() {
    if (this.state.hasError) {
      return <EmberSilkFallback />;
    }
    return this.props.children;
  }
}

export default function HeroBackground() {
  const { webgl2 } = useDeviceCapability();
  const [fallback, setFallback] = useState(false);

  if (!webgl2 || fallback) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <EmberSilkFallback />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <WebGLErrorBoundary>
        <EmberSilkBackground onFallback={() => setFallback(true)} />
      </WebGLErrorBoundary>
    </div>
  );
}
