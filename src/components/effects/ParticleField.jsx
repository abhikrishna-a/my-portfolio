import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ================================================================
   Orbiting dust particle field
   ~2500 points distributed at varying radii around the black hole.
   All animation is vertex-shader driven — zero CPU per-frame work.
   ================================================================ */

const PARTICLE_COUNT = 2500;

const VERT = /* glsl */ `
attribute float aSeed;
attribute float aRadius;
attribute float aAngle;
attribute float aYOffset;

uniform float uTime;

varying float vAlpha;
varying float vDist;

void main() {
  /* Keplerian orbit: angular speed ∝ 1/√r (closer = faster) */
  float speed = 0.3 / sqrt(max(aRadius, 0.1));
  float angle = aAngle + uTime * speed;

  /* position in orbital plane with slight vertical drift */
  float x = aRadius * cos(angle);
  float z = aRadius * sin(angle);
  float y = aYOffset + sin(uTime * 0.08 + aSeed * 6.28) * 0.25;

  vec3 worldPos = vec3(x, y, z);

  vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);

  /* size: closer = bigger, with per-particle variation */
  float baseSize = mix(1.5, 4.0, fract(aSeed * 7.13));
  gl_PointSize = baseSize * (200.0 / -mvPosition.z);

  /* alpha: slight flicker + distance fade */
  float flicker = sin(uTime * (1.0 + fract(aSeed * 3.71) * 2.0) + aSeed * 31.4) * 0.2 + 0.8;
  float distFade = 1.0 - smoothstep(3.0, 8.0, aRadius);
  vAlpha = flicker * distFade * 0.6;
  vDist = aRadius;

  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAG = /* glsl */ `
precision highp float;

varying float vAlpha;
varying float vDist;

void main() {
  /* soft circular falloff — discard outside radius */
  float r = length(gl_PointCoord - vec2(0.5));
  float softEdge = 1.0 - smoothstep(0.3, 0.5, r);
  if (softEdge < 0.01) discard;

  /* orange/amber/ember palette based on distance */
  vec3 nearColor  = vec3(1.0, 0.616, 0.227);   /* #ff9d3a — bright orange */
  vec3 midColor   = vec3(0.702, 0.396, 0.110);  /* #b3651c — burnt orange */
  vec3 farColor   = vec3(0.549, 0.180, 0.039);  /* #8c2e0a — deep red-orange */
  float normDist = clamp(vDist / 5.5, 0.0, 1.0);
  vec3 color = mix(nearColor, midColor, smoothstep(0.0, 0.5, normDist));
  color = mix(color, farColor, smoothstep(0.5, 1.0, normDist));

  gl_FragColor = vec4(color, vAlpha * softEdge);
}
`;

export default function ParticleField({ reduced }) {
  const pointsRef = useRef();
  const matRef = useRef();

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const seeds   = new Float32Array(PARTICLE_COUNT);
    const radii   = new Float32Array(PARTICLE_COUNT);
    const angles  = new Float32Array(PARTICLE_COUNT);
    const yOffsets = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const seed = Math.random();
      seeds[i] = seed;
      /* distribute at varying orbital radii: more particles closer in */
      radii[i] = 0.8 + Math.pow(Math.random(), 0.6) * 6.0;
      angles[i] = Math.random() * Math.PI * 2;
      yOffsets[i] = (Math.random() - 0.5) * 0.6; /* slight tilt */
    }

    geo.setAttribute('aSeed',   new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    geo.setAttribute('aAngle',  new THREE.BufferAttribute(angles, 1));
    geo.setAttribute('aYOffset', new THREE.BufferAttribute(yOffsets, 1));

    /* dummy position attribute required by Points */
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));

    const u = { uTime: { value: 0 } };
    return { geometry: geo, uniforms: u };
  }, []);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = reduced
      ? state.clock.elapsedTime * 0.05
      : state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} renderOrder={1}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
