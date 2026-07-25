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
  float speed = 0.3 / sqrt(max(aRadius, 0.1));
  float angle = aAngle + uTime * speed;

  float x = aRadius * cos(angle);
  float z = aRadius * sin(angle);
  float y = aYOffset + sin(uTime * 0.08 + aSeed * 6.28) * 0.25;

  vec3 worldPos = vec3(x, y, z);
  vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);

  // camera-space distance, floored so it can never approach zero
  float camDist = max(-mvPosition.z, 1.0);

  float baseSize = mix(1.5, 4.0, fract(aSeed * 7.13));
  // hard cap in addition to the floor above — belt and suspenders
  gl_PointSize = clamp(baseSize * (200.0 / camDist), 0.5, 8.0);

  float flicker = sin(uTime * (1.0 + fract(aSeed * 3.71) * 2.0) + aSeed * 31.4) * 0.2 + 0.8;
  float distFade = 1.0 - smoothstep(3.0, 8.0, aRadius);
  vAlpha = flicker * distFade * 0.3;
  vDist = aRadius;

  // push anything behind or too near the camera off-screen instead of
  // letting it rasterize as a giant point sprite
  if (mvPosition.z > -0.5) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  } else {
    gl_Position = projectionMatrix * mvPosition;
  }
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

      /* golden-ratio Fibonacci sphere distribution (ported from
         buildwithfavas/galactic-blackhole) — evenly spaced,
         no clustering, cube-root radius for more particles near center */
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
      const radius = Math.cbrt(Math.random()) * 6.0 + 0.8;

      radii[i] = radius;
      angles[i] = theta;
      yOffsets[i] = Math.cos(phi) * 0.6; /* slight vertical spread from sphere distribution */
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
