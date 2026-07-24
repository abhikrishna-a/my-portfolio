import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createBlackHoleMaterial } from './blackHoleMaterial';

export default function BlackHoleScene({ pointerRef, reducedMotion = false }) {
  const materialRef = useRef();
  const { size } = useThree();

  const material = useMemo(() => createBlackHoleMaterial(), []);

  materialRef.current = material;

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

    const t = reducedMotion ? 0.5 : state.clock.getElapsedTime();
    const p = pointerRef.current;

    mat.uniforms.uTime.value = t;
    mat.uniforms.uResolution.value.set(size.width, size.height);
    mat.uniforms.uMouse.value.set(p.x, 1.0 - p.y);
    mat.uniforms.uMouseVelocity.value.set(p.vx, -p.vy);
    mat.uniforms.uMouseActive.value = p.active;
  });

  return (
    <mesh renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" ref={materialRef} />
    </mesh>
  );
}
