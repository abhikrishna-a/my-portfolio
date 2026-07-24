import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createEmberSilkMaterial, TRAIL_LENGTH } from './emberSilkMaterial';

export default function EmberSilkScene({
  pointerRef,
  reducedMotion,
  ambientSpeed = 0.02,
  interactionStrength = 1.0,
  interactionRadius = 0.12,
  grainAmount = 0.02,
  quality = 1.0,
}) {
  const clockRef = useRef(0);

  const { size } = useThree();

  /* big-triangle geometry: 3 vertices that cover the entire viewport */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3)
    );
    return geo;
  }, []);

  const material = useMemo(() => createEmberSilkMaterial(), []);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const dt = Math.min(delta, 1 / 30);
    clockRef.current += dt;

    const u = material.uniforms;
    u.uTime.value = clockRef.current;
    u.uResolution.value.set(size.width, size.height);
    u.uReducedMotion.value = 0;

    /* configurable props */
    u.uAmbientSpeed.value = ambientSpeed;
    u.uInteractionStrength.value = interactionStrength;
    u.uInteractionRadius.value = interactionRadius;
    u.uGrainAmount.value = grainAmount;
    u.uQuality.value = quality;

    /* pointer state from imperative ref — zero React re-renders */
    const p = pointerRef.current;
    u.uPointer.value.set(p.x, p.y);
    u.uPointerVelocity.value.set(p.vx, p.vy);
    u.uPointerVelocityMagnitude.value = Math.min(p.speed, 5.0);

    /* fade active when pointer idle (>100ms since last move) */
    const now = performance.now() / 1000;
    const idle = now - (p.lastMoveTime || 0);
    if (idle > 0.1) {
      p.active *= Math.max(0, 1 - dt / 2.0);
    }
    u.uPointerActive.value = p.active;

    /* update trail ages */
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      p.trail[i].age += dt;
      u.uPointerTrail.value[i].set(p.trail[i].x, p.trail[i].y);
      u.uPointerTrailAge.value[i] = p.trail[i].age;
    }
  });

  return (
    <mesh geometry={geometry} material={material} frustumCulled={false} />
  );
}
