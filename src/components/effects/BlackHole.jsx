import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ================================================================
   GLSL ES 1.00 — Gargantua-style raymarched black hole
   Horizon + gravitational lensing + accretion disk + starfield
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
uniform vec4  uTrail[16];
uniform int   uTrailCount;

varying vec2 vUv;

/* ── constants ── */
#define HORIZON      0.55
#define DISK_INNER   1.15
#define DISK_OUTER   5.5
#define STEP_SIZE    0.08
#define MAX_STEPS    80
#define LENS_K       2.5
#define PI           3.14159265

/* ── hash / noise (ported from buildwithfavas/galactic-blackhole) ── */
float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 231.13));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
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

/* 6-octave FBM with domain warp — much richer than original 4-octave */
float fbm(vec2 p) {
  float v = 0.0, a = 0.65;
  float persistence = 0.5;
  for (int i = 0; i < 6; i++) {
    float n = noise2D(p);
    v += a * n;
    /* domain warp — offsets next octave by noise value for organic swirling */
    vec2 warp = vec2(n * 0.18, -n * 0.12);
    p += warp * a * 0.5;
    p *= 2.0;
    a *= persistence;
  }
  return v;
}

/* spiral vortex pattern — creates visible arm structure in the disk
   (ported from buildwithfavas/galactic-blackhole) */
float vortexPattern(float dist, float angle, float t) {
  float spiralStrength = 5.8;
  float angleOffset = dist * 0.28;
  float spiral = sin(angle * 2.3 + angleOffset + dist * spiralStrength - t * 0.6);
  return smoothstep(-0.38, 0.68, spiral) * 0.32;
}

/* ── hash for starfield ── */
float hash31(vec3 p) {
  p = fract(p * vec3(233.34, 231.13, 227.97));
  p += dot(p, p.yxz + 23.45);
  return fract(dot(p, p.yxz));
}

void main() {
  vec2 uv = vUv;
  float aspect = iResolution.x / iResolution.y;

  /* ================================================================
     1. VIEW RAY — build from camera basis vectors
     ================================================================ */
  vec3 dir = normalize(uCamForward + (uv.x - 0.5) * aspect * uCamRight + (uv.y - 0.5) * uCamUp);

  /* ================================================================
     2. TRAIL VORTEX DISPLACEMENT — warp the entire lensed image
     Each active trail point pushes the UV perpendicular to the
     displacement vector, with gaussian falloff by distance.
     This makes disk and stars visibly swirl locally.
     ================================================================ */
  vec2 warpedUv = uv;
  for (int i = 0; i < 16; i++) {
    if (i >= uTrailCount) break;
    vec2 tPos = uTrail[i].xy;
    float tAge = uTrail[i].z;
    float tStr = uTrail[i].w;
    vec2 delta = uv - tPos;
    float dist = length(delta);
    float falloff = exp(-dist * dist * 8.0);
    vec2 perp = vec2(-delta.y, delta.x);
    warpedUv += perp * tStr * falloff * (1.0 - tAge) * 0.15;
  }

  /* rebuild ray from warped uv */
  dir = normalize(uCamForward + (warpedUv.x - 0.5) * aspect * uCamRight + (warpedUv.y - 0.5) * uCamUp);

  /* ================================================================
     3. RAYMARCH with gravitational deflection
     At each step compute angular momentum h = cross(pos, dir),
     then apply centripetal-like deflection toward the mass at origin.
     Larger LENS_K = more dramatic far-side disk folding.
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

    /* gravitational deflection via angular momentum */
    vec3 h = cross(pos, rayDir);
    float h2 = dot(h, h);
    vec3 deflection = -LENS_K * h2 * pos / (r * r * r * r * r + 0.001);
    rayDir = normalize(rayDir + deflection * STEP_SIZE);
    pos += rayDir * STEP_SIZE;

    minR = min(minR, length(pos));

    /* ================================================================
       4. EVENT HORIZON — if ray falls in, force pure black
       CRITICAL: color must be zeroed; no stray disk light leaks through
       ================================================================ */
    if (length(pos) < HORIZON) {
      col = vec3(0.0);
      accAlpha = 1.0;
      absorbed = true;
      break;
    }

    /* ================================================================
       5. ACCRETION DISK — detect y=0 plane crossing
       Between prevPos and pos, check for sign change in y.
       Solve for exact crossing point via linear interpolation.
       ================================================================ */
    if (prevPos.y * pos.y < 0.0) {
      float t = prevPos.y / (prevPos.y - pos.y);
      vec3 hitPos = prevPos + t * (pos - prevPos);
      float rr = length(hitPos.xz);

      if (rr > DISK_INNER && rr < DISK_OUTER) {
        float normR = (rr - DISK_INNER) / (DISK_OUTER - DISK_INNER);

        /* Keplerian rotation — inner edge spins faster
           (ported from buildwithfavas/galactic-blackhole) */
        float angle = atan(hitPos.z, hitPos.x);
        float rotSpeed = 4.8 / (pow(rr, 1.6) + 1.1);
        float rotatedAngle = angle - iTime * rotSpeed * 0.52;

        /* 6-octave FBM with warp + vortex spiral for rich disk structure
           (ported from buildwithfavas/galactic-blackhole) */
        float evolvingTime = iTime * 0.17;
        vec2 baseCoord = vec2(rr * 1.9, rotatedAngle * 3.6);
        float noiseFast = fbm(baseCoord) * 0.7;
        float noiseSlow = fbm(baseCoord * 0.6 + 10.0) * 0.4;
        float noiseValue = noiseFast + noiseSlow;
        float vortexValue = vortexPattern(rr, angle, iTime);
        float finalPattern = noiseValue * 0.8 + vortexValue * 1.1;

        /* Doppler beaming — approaching side brighter
           (ported from buildwithfavas/galactic-blackhole) */
        float doppler = 0.0;
        float beaming = 1.0;
        vec3 toCam = normalize(uCamPos - hitPos);
        vec3 tangential = normalize(vec3(-hitPos.z, 0.0, hitPos.x));
        doppler = dot(toCam, tangential) * (1.0 / sqrt(max(rr, 0.1))) * 0.3;
        beaming = clamp(1.0 + doppler * 0.4, 0.5, 2.0);

        /* color ramp — black/orange palette only
           outer: deep red-orange  #661a00 → #8c2e0a
           mid:   orange-amber    #ff9d3a / #ffb347
           inner: white-hot       #fff (clips)
           (ported from buildwithfavas/galactic-blackhole inferno theme) */
        vec3 cDeep   = vec3(0.400, 0.102, 0.000);  /* #661a00 */
        vec3 cEdge   = vec3(0.800, 0.200, 0.102);  /* #cc331a */
        vec3 cMid    = vec3(1.0, 0.667, 0.200);    /* #ffaa33 */
        vec3 cHot    = vec3(1.0, 1.0, 1.0);        /* white-hot core */

        vec3 diskCol = mix(cDeep, cEdge, smoothstep(0.0, 0.40, normR));
        diskCol = mix(diskCol, cMid, smoothstep(0.40, 0.80, normR));
        diskCol = mix(diskCol, cHot, smoothstep(0.80, 1.0, normR));

        /* redshift — receding side redder (ported from reference) */
        float redshiftFactor = doppler * 0.15;
        diskCol *= vec3(1.0 + redshiftFactor, 1.0, 1.0 - redshiftFactor);

        /* brightness: pattern + radial falloff + beaming
           (ported from buildwithfavas/galactic-blackhole) */
        float patternBrightness = (finalPattern + 0.5) * 1.15;
        patternBrightness += pow(max(0.0, finalPattern - 0.5), 1.3) * 0.6;
        float radialBrightness = pow(1.0 - smoothstep(0.0, 0.8, normR), 1.9) * 3.0 + 0.25;
        float finalBrightness = patternBrightness * radialBrightness * beaming;

        /* hot core boost — blow out the inner edge to near-white */
        float hotBoost = smoothstep(3.0, 5.0, finalBrightness) * smoothstep(0.0, 0.1, normR);
        diskCol = mix(diskCol, vec3(1.0), hotBoost * 0.45);

        diskCol *= finalBrightness;

        /* alpha with smooth edges
           (ported from buildwithfavas/galactic-blackhole) */
        float innerAlpha = smoothstep(0.0, 0.06, normR);
        float outerAlpha = 1.0 - smoothstep(0.85, 1.0, normR);
        float noiseAlpha = clamp(finalPattern * 0.35 + 0.75, 0.65, 1.0);
        float diskAlpha = innerAlpha * outerAlpha * noiseAlpha;

        /* accumulate disk color with alpha compositing */
        col += diskCol * diskAlpha * (1.0 - accAlpha);
        accAlpha += diskAlpha * (1.0 - accAlpha);
        if (accAlpha > 0.99) break;
      }
    }
  }

  /* ================================================================
     6. BACKGROUND — if ray escaped without hitting horizon
     Procedural starfield (amber-tinted) + faint nebula
     ================================================================ */
  if (!absorbed) {
    /* starfield: grid-based procedural stars */
    vec2 starUv = warpedUv * 300.0;
    vec2 starCell = floor(starUv);
    float starRand = hash31(vec3(starCell, 1.0));
    if (starRand > 0.985) {
      vec2 starF = fract(starUv) - 0.5;
      float starDist = length(starF);
      float starSize = hash31(vec3(starCell, 2.0)) * 0.15 + 0.05;
      float starBright = smoothstep(starSize, 0.0, starDist);
      /* amber-white tint only — no blue/purple/green */
      vec3 starCol = mix(vec3(0.949, 0.925, 0.878), vec3(1.0, 0.85, 0.6), hash31(vec3(starCell, 3.0)));
      float twinkle = sin(iTime * (starRand * 1.5 + 0.5) + starRand * 62.8) * 0.15 + 0.85;
      col += starCol * starBright * twinkle * (1.0 - accAlpha);
    }

    /* faint low-frequency nebula — burnt-orange at very low opacity */
    float neb1 = fbm(warpedUv * 3.0 + iTime * 0.01);
    float neb2 = fbm(warpedUv * 1.5 + 50.0 - iTime * 0.008);
    float neb = smoothstep(0.3, 0.6, neb1 * 0.6 + neb2 * 0.4);
    col += vec3(0.6, 0.25, 0.08) * neb * 0.06 * (1.0 - accAlpha);

    /* ================================================================
       PHOTON RING GLOW — based on minimum radius reached
       Welds the lensed ring to top/bottom of the silhouette
       ================================================================ */
    float glowDist = minR - HORIZON;
    float photonGlow = exp(-glowDist * 4.0) * 0.15;
    photonGlow *= smoothstep(0.0, 0.3, glowDist) * (1.0 - smoothstep(0.3, 1.5, glowDist));
    col += vec3(1.0, 0.667, 0.200) * photonGlow * (1.0 - accAlpha);
  }

  /* ================================================================
     7. TONE MAPPING — Reinhard-style + gamma + vignette
     ================================================================ */
  col = col / (1.0 + col * 0.6);
  col = pow(col, vec3(0.85));

  /* mild vignette */
  vec2 vigUv = vUv - 0.5;
  col *= 1.0 - dot(vigUv, vigUv) * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ================================================================
   React component — full-screen quad with shaderMaterial
   ================================================================ */

export default function BlackHole({ mouse, trailArray, trailCount, reduced, uniformsRef }) {
  const matRef = useRef();

  const uniforms = useMemo(() => {
    const u = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      uCamPos:     { value: new THREE.Vector3(0, 0, 5.6) },
      uCamRight:   { value: new THREE.Vector3(1, 0, 0) },
      uCamUp:      { value: new THREE.Vector3(0, 1, 0) },
      uCamForward: { value: new THREE.Vector3(0, 0, -1) },
      uTrail:      { value: Array.from({ length: 16 }, () => new THREE.Vector4()) },
      uTrailCount: { value: 0 },
    };
    /* expose uniforms to parent via ref for camera basis writes */
    if (uniformsRef) uniformsRef.current = u;
    return u;
  }, [uniformsRef]);

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.iTime.value = reduced ? state.clock.elapsedTime * 0.05 : state.clock.elapsedTime;

    /* pass trail data into uniforms */
    const buf = trailArray.current;
    const count = trailCount.current;
    u.uTrailCount.value = count;
    for (let i = 0; i < 16; i++) {
      const base = i * 4;
      u.uTrail.value[i].set(buf[base], buf[base + 1], buf[base + 2], buf[base + 3]);
    }
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

/* export uniforms ref so BackgroundScene can write camera basis + resolution */
export { VERT, FRAG };
