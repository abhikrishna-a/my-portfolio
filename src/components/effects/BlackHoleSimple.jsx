import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const INNER_COUNT = 800;
const OUTER_COUNT = 400;
const DUST_COUNT  = 200;

/* Compact scale — the object now spans roughly the same screen size as
   the full tier's shadow (~21% of viewport height) so it sits behind
   the "ABHIKRISHNA" name, clear of the subtitle/status text. The solid
   gradient ring (RING_IN→RING_OUT) hugging the black sphere (SPHERE)
   reads as the disk; the particles add fibrous motion on top. */
const SPHERE_RADIUS = 1.45;
const RING_IN       = 1.5;
const RING_OUT      = 2.3;
const INNER_R_MIN   = 1.15, INNER_R_MAX = 1.6;
const OUTER_R_MIN   = 1.55, OUTER_R_MAX = 2.1;
const DUST_R_MIN    = 1.9,  DUST_R_MAX  = 2.4;
const INNER_SPEED   = 0.12;
const OUTER_SPEED   = 0.04;
const DUST_SPEED    = 0.015;

/* refRamp — JS twin of the full-tier shader's radial ramp so the simple
   tier shares the same gold → rust → black color language */
function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
function refRamp(t, boost = 1) {
  const gold = [0.95, 0.71, 0.40];
  const rust = [0.14, 0.05, 0.03];
  const black = [0, 0, 0];
  const s1 = smoothstep(0.05, 0.425, t);
  const s2 = smoothstep(0.425, 1.0, t);
  const c = [
    gold[0] + (rust[0] - gold[0]) * s1,
    gold[1] + (rust[1] - gold[1]) * s1,
    gold[2] + (rust[2] - gold[2]) * s1,
  ];
  return [
    (c[0] + (black[0] - c[0]) * s2) * boost,
    (c[1] + (black[1] - c[1]) * s2) * boost,
    (c[2] + (black[2] - c[2]) * s2) * boost,
  ];
}
function buildRingGeometry(inner, outer, boost) {
  const geo = new THREE.RingGeometry(inner, outer, 96, 1);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i));
    const t = (r - inner) / (outer - inner);
    const c = refRamp(t, boost);
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

function createGlowTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,   'rgba(255,160,40,0.4)');
  g.addColorStop(0.3, 'rgba(255,100,20,0.15)');
  g.addColorStop(0.6, 'rgba(200,50,10,0.04)');
  g.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function buildDisk(rMin, rMax, count, colorInner, colorOuter, ySpread, speed) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const angles = new Float32Array(count);
  const radii = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = rMin + Math.random() * (rMax - rMin);
    const angle = Math.random() * Math.PI * 2;

    pos[i * 3]     = Math.cos(angle) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * ySpread;
    pos[i * 3 + 2] = Math.sin(angle) * r;

    const t = (r - rMin) / (rMax - rMin);
    col[i * 3]     = colorInner[0] + (colorOuter[0] - colorInner[0]) * t;
    col[i * 3 + 1] = colorInner[1] + (colorOuter[1] - colorInner[1]) * t;
    col[i * 3 + 2] = colorInner[2] + (colorOuter[2] - colorInner[2]) * t;

    angles[i] = angle;
    radii[i] = r;
    speeds[i] = speed / Math.sqrt(r);
  }

  return { positions: pos, colors: col, angles, radii, speeds };
}

const DISK_VERT = /* glsl */ `
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
uniform float uTime;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float angle = aAngle + uTime * aSpeed;
  float x = aRadius * cos(angle);
  float z = aRadius * sin(angle);

  vec4 mvPosition = modelViewMatrix * vec4(x, position.y, z, 1.0);
  float camDist = max(-mvPosition.z, 1.0);
  gl_PointSize = clamp(mix(2.0, 5.0, fract(aAngle * 7.13)) * (200.0 / camDist), 1.0, 12.0);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  float distFade = 1.0 - smoothstep(0.0, 1.0, (aRadius - ${String(INNER_R_MIN)}) / (${String(OUTER_R_MAX)} - ${String(INNER_R_MIN)}));
  vAlpha = mix(0.4, 0.95, distFade);
}
`;

const DISK_FRAG = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  float softEdge = 1.0 - smoothstep(0.25, 0.5, r);
  if (softEdge < 0.01) discard;
  gl_FragColor = vec4(vColor, vAlpha * softEdge);
}
`;

const DUST_VERT = /* glsl */ `
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
uniform float uTime;
varying float vAlpha;

void main() {
  float angle = aAngle + uTime * aSpeed;
  float x = aRadius * cos(angle);
  float z = aRadius * sin(angle);

  vec4 mvPosition = modelViewMatrix * vec4(x, position.y, z, 1.0);
  float camDist = max(-mvPosition.z, 1.0);
  gl_PointSize = clamp(3.0 * (200.0 / camDist), 1.0, 8.0);
  gl_Position = projectionMatrix * mvPosition;

  vAlpha = 0.3;
}
`;

const DUST_FRAG = /* glsl */ `
precision highp float;
varying float vAlpha;

void main() {
  float r = length(gl_PointCoord - vec2(0.5));
  float softEdge = 1.0 - smoothstep(0.3, 0.5, r);
  if (softEdge < 0.01) discard;
  gl_FragColor = vec4(0.55, 0.12, 0.04, vAlpha * softEdge);
}
`;

export default function BlackHoleSimple({ reduced }) {
  const glowRef = useRef();
  const innerMatRef = useRef();
  const outerMatRef = useRef();
  const dustPointsRef = useRef();
  const startTime = useRef(performance.now());

  const glowTexture = useMemo(() => createGlowTexture(), []);

  const innerDisk = useMemo(() => buildDisk(
    INNER_R_MIN, INNER_R_MAX, INNER_COUNT,
    [1.0, 0.82, 0.48], [0.95, 0.55, 0.22], 0.12, INNER_SPEED
  ), []);

  const outerDisk = useMemo(() => buildDisk(
    OUTER_R_MIN, OUTER_R_MAX, OUTER_COUNT,
    [0.8, 0.4, 0.12], [0.3, 0.1, 0.05], 0.18, OUTER_SPEED
  ), []);

  const dustHalo = useMemo(() => buildDisk(
    DUST_R_MIN, DUST_R_MAX, DUST_COUNT,
    [0.5, 0.12, 0.04], [0.15, 0.04, 0.02], 0.35, DUST_SPEED
  ), []);

  const diskTilt = useMemo(() => new THREE.Euler(0, 0, 0), []);

  const sharedUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (reduced) return;
    const elapsed = (performance.now() - startTime.current) * 0.001;
    sharedUniforms.uTime.value = elapsed;

    if (glowRef.current) {
      const pulse = 1.0 + Math.sin(elapsed * 0.5) * 0.08;
      glowRef.current.scale.set(2.2 * pulse, 2.2 * pulse, 1);
    }
  });

  const innerGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(innerDisk.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(innerDisk.colors, 3));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(innerDisk.angles, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(innerDisk.radii, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(innerDisk.speeds, 1));
    return geo;
  }, []);

  const outerGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(outerDisk.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(outerDisk.colors, 3));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(outerDisk.angles, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(outerDisk.radii, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(outerDisk.speeds, 1));
    return geo;
  }, []);

  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(dustHalo.positions, 3));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(dustHalo.angles, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(dustHalo.radii, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(dustHalo.speeds, 1));
    return geo;
  }, []);

  const ringGeo = useMemo(() => buildRingGeometry(RING_IN, RING_OUT, 1.8), []);

  return (
    <group rotation={[0, 0, 0.12]}>
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS, 48, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh geometry={ringGeo} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <sprite ref={glowRef} position={[0, 0, -0.1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      <points ref={innerMatRef} rotation={diskTilt} geometry={innerGeo}>
        <shaderMaterial
          vertexShader={DISK_VERT}
          fragmentShader={DISK_FRAG}
          uniforms={sharedUniforms}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={outerMatRef} rotation={diskTilt} geometry={outerGeo}>
        <shaderMaterial
          vertexShader={DISK_VERT}
          fragmentShader={DISK_FRAG}
          uniforms={sharedUniforms}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={dustPointsRef} rotation={diskTilt} geometry={dustGeo}>
        <shaderMaterial
          vertexShader={DUST_VERT}
          fragmentShader={DUST_FRAG}
          uniforms={sharedUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
