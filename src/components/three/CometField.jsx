import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COMET_COUNT = 15;
const TRAIL_LENGTH = 30;
const STAR_COUNT = 200;

function CometField() {
  const cometsRef = useRef();
  const cometsData = useRef([]);

  const cometGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COMET_COUNT * TRAIL_LENGTH * 3);
    const opacities = new Float32Array(COMET_COUNT * TRAIL_LENGTH);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    return geo;
  }, []);

  const starGeometry = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const initComet = useCallback((i) => {
    const side = Math.floor(Math.random() * 3);
    let x, y, vx, vy;
    const speed = 0.02 + Math.random() * 0.04;
    if (side === 0) {
      x = -6;
      y = (Math.random() - 0.5) * 10;
      vx = speed;
      vy = (Math.random() - 0.3) * speed * 0.5;
    } else if (side === 1) {
      x = (Math.random() - 0.5) * 12;
      y = 6;
      vx = (Math.random() - 0.3) * speed * 0.5;
      vy = -speed;
    } else {
      x = 8;
      y = (Math.random() - 0.5) * 10;
      vx = -speed;
      vy = (Math.random() - 0.3) * speed * 0.3;
    }
    cometsData.current[i] = { x, y, vx, vy, trail: [] };
  }, []);

  useMemo(() => {
    for (let i = 0; i < COMET_COUNT; i++) initComet(i);
  }, [initComet]);

  const cometMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float opacity;
        varying float vOpacity;
        void main() {
          vOpacity = opacity;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
          gl_FragColor = vec4(1.0, 0.55, 0.13, alpha);
        }
      `,
    });
  }, []);

  useFrame(() => {
    const positions = cometGeometry.attributes.position.array;
    const opacities = cometGeometry.attributes.opacity.array;

    for (let i = 0; i < COMET_COUNT; i++) {
      const c = cometsData.current[i];
      c.x += c.vx;
      c.y += c.vy;

      c.trail.unshift({ x: c.x, y: c.y });
      if (c.trail.length > TRAIL_LENGTH) c.trail.pop();

      const isDead = c.x < -8 || c.x > 8 || c.y < -7 || c.y > 7;
      if (isDead) initComet(i);

      for (let j = 0; j < TRAIL_LENGTH; j++) {
        const idx = (i * TRAIL_LENGTH + j) * 3;
        const point = c.trail[j];
        if (point) {
          positions[idx] = point.x;
          positions[idx + 1] = point.y;
          positions[idx + 2] = -1;
        } else {
          positions[idx] = c.x;
          positions[idx + 1] = c.y;
          positions[idx + 2] = -1;
        }
        opacities[i * TRAIL_LENGTH + j] = 1.0 - j / TRAIL_LENGTH;
      }
    }

    cometGeometry.attributes.position.needsUpdate = true;
    cometGeometry.attributes.opacity.needsUpdate = true;
  });

  return (
    <group>
      <points geometry={starGeometry}>
        <pointsMaterial color="#ffffff" size={0.015} transparent opacity={0.4} sizeAttenuation />
      </points>
      <points geometry={cometGeometry} material={cometMaterial} />
    </group>
  );
}

export default CometField;
