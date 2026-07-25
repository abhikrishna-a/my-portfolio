import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ================================================================
   GLSL ES 1.00 — Schwarzschild black hole raymarcher
   Proper geodesic integration + Novikov-Thorne disk + g⁴ beaming
   No mouse interaction — clean static camera view
   ================================================================ */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec3  uCamPos;
uniform vec3  uCamRight;
uniform vec3  uCamUp;
uniform vec3  uCamForward;

varying vec2 vUv;

/* ================================================================
   CONSTANTS — Schwarzschild black hole
   M = 0.5, r_s = 2M = 1.0
   ISCO = 6M = 3.0, photon sphere = 3M = 1.5
   ================================================================ */
#define M          0.5
#define RS         1.0
#define DISK_IN    3.0
#define DISK_OUT   12.0
#define MAX_STEPS  120
#define PI         3.14159265

/* ================================================================
   UTILITY FUNCTIONS
   ================================================================ */

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 231.13));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float hash31(vec3 p) {
  p = fract(p * vec3(233.34, 231.13, 227.97));
  p += dot(p, p.yxz + 23.45);
  return fract(dot(p, p.yxz));
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i),            hash21(i + vec2(1, 0)), f.x),
    mix(hash21(i + vec2(0,1)),hash21(i + vec2(1, 1)), f.x),
    f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.65;
  for (int i = 0; i < 6; i++) {
    float n = noise2D(p);
    v += a * n;
    vec2 warp = vec2(n * 0.18, -n * 0.12);
    p += warp * a * 0.5;
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

float vortexPattern(float dist, float angle, float t) {
  float spiral = sin(angle * 2.3 + dist * 0.28 + dist * 5.8 - t * 0.6);
  return smoothstep(-0.38, 0.68, spiral) * 0.32;
}

/* ACES filmic tone mapping */
vec3 acesToneMap(vec3 x) {
  float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

/* ================================================================
   MAIN
   ================================================================ */

void main() {
  vec2 uv = vUv;
  float aspect = iResolution.x / iResolution.y;

  /* ================================================================
     1. VIEW RAY — build from camera basis vectors
     ================================================================ */
  vec3 dir = normalize(uCamForward + (uv.x - 0.5) * aspect * uCamRight + (uv.y - 0.5) * uCamUp);

  /* ================================================================
     2. RAYMARCH with proper Schwarzschild geodesic
     Geodesic: d²x/dλ² = -3M · h² · x / r⁵
     ================================================================ */
  vec3 pos = uCamPos;
  vec3 rayDir = dir;
  vec3 col = vec3(0.0);
  float accAlpha = 0.0;
  bool absorbed = false;
  float minR = 1e10;

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 prevPos = pos;
    float r = length(pos);

    /* adaptive step size — smaller near photon sphere */
    float stepSize = 0.015 + 0.085 * smoothstep(1.0, 5.0, r);

    /* Schwarzschild deflection: a = -3M · h² · pos / r⁵ */
    vec3 h = cross(pos, rayDir);
    float h2 = dot(h, h);
    vec3 acc = -1.5 * h2 * pos / (r * r * r * r * r + 0.001);

    /* symplectic Euler */
    rayDir = normalize(rayDir + acc * stepSize);
    pos += rayDir * stepSize;

    minR = min(minR, length(pos));

    /* event horizon */
    if (length(pos) < RS) {
      col = vec3(0.0);
      accAlpha = 1.0;
      absorbed = true;
      break;
    }

    /* accretion disk — y=0 plane crossing */
    if (prevPos.y * pos.y < 0.0) {
      float t = prevPos.y / (prevPos.y - pos.y);
      vec3 hitPos = prevPos + t * (pos - prevPos);
      float nr = length(hitPos.xz);

      if (nr > DISK_IN && nr < DISK_OUT) {
        float normR = (nr - DISK_IN) / (DISK_OUT - DISK_IN);

        /* Novikov-Thorne temperature */
        float rRatio = DISK_IN / nr;
        float T = pow(max(0.0, rRatio * rRatio * rRatio * (1.0 - sqrt(rRatio))), 0.25);

        /* Keplerian rotation */
        float angle = atan(hitPos.z, hitPos.x);
        float rotSpeed = 4.8 / (pow(nr, 1.6) + 1.1);
        float rotatedAngle = angle - iTime * rotSpeed * 0.52;

        /* 6-octave FBM with warp + vortex spiral */
        vec2 baseCoord = vec2(nr * 1.9, rotatedAngle * 3.6);
        float noiseFast = fbm(baseCoord) * 0.7;
        float noiseSlow = fbm(baseCoord * 0.6 + 10.0) * 0.4;
        float noiseValue = noiseFast + noiseSlow;
        float vortexValue = vortexPattern(nr, angle, iTime);
        float finalPattern = noiseValue * 0.8 + vortexValue * 1.1;

        /* g⁴ relativistic beaming */
        vec3 toCam = normalize(uCamPos - hitPos);
        vec3 tangential = normalize(vec3(-hitPos.z, 0.0, hitPos.x));
        float doppler = dot(toCam, tangential);
        float vOrb = sqrt(M / max(nr, DISK_IN));
        float gamma = 1.0 / sqrt(max(0.01, 1.0 - vOrb * vOrb));
        float delta = gamma * (1.0 + doppler * vOrb);
        float gGrav = sqrt(max(0.01, 1.0 - RS / nr));
        float gTotal = gGrav * delta;
        float g4 = gTotal * gTotal * gTotal * gTotal;

        /* disk color from temperature + Doppler */
        vec3 cDeep   = vec3(0.400, 0.102, 0.000);
        vec3 cEdge   = vec3(0.800, 0.200, 0.102);
        vec3 cMid    = vec3(1.0, 0.667, 0.200);
        vec3 cHot    = vec3(1.0, 1.0, 1.0);

        vec3 diskCol = mix(cDeep, cEdge, smoothstep(0.0, 0.40, T));
        diskCol = mix(diskCol, cMid, smoothstep(0.40, 0.75, T));
        diskCol = mix(diskCol, cHot, smoothstep(0.75, 1.0, T));

        /* gravitational redshift */
        float gravRedshift = (1.0 / max(gGrav, 0.3) - 1.0) * 0.15;
        diskCol *= vec3(1.0 + gravRedshift, 1.0, 1.0 - gravRedshift * 0.5);

        /* Doppler color shift */
        float dopplerColorShift = doppler * vOrb * 0.1;
        diskCol *= vec3(1.0 + dopplerColorShift, 1.0, 1.0 - dopplerColorShift);

        /* brightness */
        float patternBrightness = (finalPattern + 0.5) * 1.1;
        patternBrightness += pow(max(0.0, finalPattern - 0.5), 1.3) * 0.5;
        float radialBrightness = pow(1.0 - smoothstep(0.0, 0.8, normR), 1.9) * 2.2 + 0.2;
        float finalBrightness = patternBrightness * radialBrightness * g4;

        /* hot core */
        float hotBoost = smoothstep(3.0, 5.0, finalBrightness) * smoothstep(0.0, 0.1, normR);
        diskCol = mix(diskCol, vec3(1.0), hotBoost * 0.4);

        diskCol *= finalBrightness;

        /* sharp disk alpha */
        float innerAlpha = smoothstep(0.0, 0.08, normR);
        float outerAlpha = 1.0 - smoothstep(0.78, 0.95, normR);
        float noiseAlpha = clamp(finalPattern * 0.3 + 0.75, 0.65, 1.0);
        float diskAlpha = innerAlpha * outerAlpha * noiseAlpha;

        col += diskCol * diskAlpha * (1.0 - accAlpha);
        accAlpha += diskAlpha * (1.0 - accAlpha);
        if (accAlpha > 0.99) break;
      }
    }
  }

  /* ================================================================
     3. BACKGROUND — stars + photon ring
     ================================================================ */
  if (!absorbed) {
    /* starfield */
    vec2 starUv = uv * 300.0;
    vec2 starCell = floor(starUv);
    float starRand = hash31(vec3(starCell, 1.0));
    if (starRand > 0.990) {
      vec2 starF = fract(starUv) - 0.5;
      float starDist = length(starF);
      float starSize = hash31(vec3(starCell, 2.0)) * 0.15 + 0.05;
      float starBright = smoothstep(starSize, 0.0, starDist);
      vec3 starCol = mix(vec3(0.949, 0.925, 0.878), vec3(1.0, 0.85, 0.6), hash31(vec3(starCell, 3.0)));
      float twinkle = sin(iTime * (starRand * 1.5 + 0.5) + starRand * 62.8) * 0.15 + 0.85;
      col += starCol * starBright * twinkle * (1.0 - accAlpha);
    }

    /* photon ring */
    float glowDist = minR - RS;
    float photonGlow = exp(-glowDist * 8.0) * 0.15;
    photonGlow *= smoothstep(0.0, 0.05, glowDist) * (1.0 - smoothstep(0.05, 0.5, glowDist));
    col += vec3(1.0, 0.8, 0.4) * photonGlow * (1.0 - accAlpha);

    /* secondary photon ring */
    float secGlow = exp(-glowDist * 3.0) * 0.04;
    secGlow *= smoothstep(0.0, 0.15, glowDist) * (1.0 - smoothstep(0.15, 1.2, glowDist));
    col += vec3(1.0, 0.6, 0.15) * secGlow * (1.0 - accAlpha);
  }

  /* ================================================================
     4. TONE MAPPING — ACES filmic + vignette
     ================================================================ */
  col = acesToneMap(col * 1.2);

  vec2 vigUv = vUv - 0.5;
  col *= 1.0 - dot(vigUv, vigUv) * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ================================================================
   React component — full-screen quad with shaderMaterial
   ================================================================ */

export default function BlackHole({ reduced, uniformsRef }) {
  const matRef = useRef();

  const uniforms = useMemo(() => {
    const u = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      uCamPos:     { value: new THREE.Vector3(0, 0, 9.0) },
      uCamRight:   { value: new THREE.Vector3(1, 0, 0) },
      uCamUp:      { value: new THREE.Vector3(0, 1, 0) },
      uCamForward: { value: new THREE.Vector3(0, 0, -1) },
    };
    if (uniformsRef) uniformsRef.current = u;
    return u;
  }, [uniformsRef]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.iTime.value =
      reduced ? state.clock.elapsedTime * 0.05 : state.clock.elapsedTime;
  });

  return (
    <mesh renderOrder={0}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
