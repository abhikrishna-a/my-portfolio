import { Canvas } from '@react-three/fiber';
import CometField from './CometField';

export default function StarfieldNebula() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ alpha: false, antialias: false }}
      dpr={[1, 1.5]}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <CometField />
    </Canvas>
  );
}
