import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 600;
const SPHERE_RADIUS = 100;

const VERT = /* glsl */ `
attribute float aBaseSize;
attribute float aSeed;
uniform float uTime;
varying vec3 vColor;

void main() {
  float twinkle = 0.7 + 0.3 * sin(uTime * (0.5 + aSeed * 0.3) + aSeed * 10.0);
  float size = aBaseSize * twinkle;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float camDist = max(-mvPosition.z, 1.0);
  gl_PointSize = clamp(size * (200.0 / camDist), 0.5, 4.0);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec3 vColor;

void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  float softEdge = 1.0 - smoothstep(0.2, 0.5, r);
  if (softEdge < 0.01) discard;
  gl_FragColor = vec4(vColor, softEdge);
}
`;

export default function StarDome({ reduced }) {
  const pointsRef = useRef();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const siz = new Float32Array(STAR_COUNT);
    const sed = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / STAR_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      pos[i * 3]     = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = SPHERE_RADIUS * Math.cos(phi);
      pos[i * 3 + 2] = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);

      const colorType = i % 5;
      if (colorType === 0) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.55;
      } else if (colorType === 1) {
        col[i * 3] = 0.85; col[i * 3 + 1] = 0.9; col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 1.0; col[i * 3 + 1] = 1.0; col[i * 3 + 2] = 1.0;
      }

      siz[i] = 0.3 + Math.random() * 0.7;
      sed[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aBaseSize', new THREE.BufferAttribute(siz, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(sed, 1));
    return geo;
  }, []);

  useFrame((state) => {
    if (reduced || !pointsRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
