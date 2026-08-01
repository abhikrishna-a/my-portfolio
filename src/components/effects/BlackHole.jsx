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

function buildFragmentShader(maxSteps) {
  /* compile-time step ceiling — lets the GLSL compiler fully optimize the
     loop on mobile drivers instead of reserving 256 iterations, while the
     uActiveSteps uniform still tunes below this ceiling at runtime */
  const steps = Math.max(32, Math.min(256, Math.floor(maxSteps) || 256));
  return /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float iTime;
uniform vec2  iResolution;
uniform vec3  uCamPos;
uniform vec3  uCamRight;
uniform vec3  uCamUp;
uniform vec3  uCamForward;
uniform float uActiveSteps;
uniform float uDebugMode;

varying vec2 vUv;

/* ================================================================
   CONSTANTS — Schwarzschild black hole
   M = 0.42, r_s = 2M = 0.84
   ISCO = 6M = 2.52, photon sphere = 3M = 1.26
   Scaled DOWN ~0.6x from the 1.4x iteration (M=0.7, RS=1.4) so the
   black event-horizon disk alone lands at ~20-26% of the shorter
   viewport edge and the whole lensed structure (disk + photon halo +
   bloom) stays under ~48% of viewport height with visible dark
   margin on all four sides. Every world-space length below — RS,
   DISK_IN/OUT, step sizes, photon-glow falloff + band edges, radial
   noise frequencies — is scaled by the SAME factor s = 0.6 so the
   image is self-similar (texture density, glow extent and the step
   budget are all preserved by construction). RS alone cannot move
   the shadow: geodesic deflection is governed by M, and rays never
   come inside the photon sphere, so the horizon test only fires
   when M scales.
   ================================================================ */
#define M          0.42
#define RS         0.84
#define DISK_IN    1.08
#define DISK_OUT   7.2
#define MAX_STEPS  ${steps}
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

float fbm3(vec2 p) {
  float v = 0.0, a = 0.65;
  for (int i = 0; i < 3; i++) {
    float n = noise2D(p);
    v += a * n;
    p += vec2(n * 0.18, -n * 0.12) * a * 0.5;
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

float vortexPattern(float dist, float angle, float t) {
  float spiral = sin(angle * 2.3 + dist * 7.12 + dist * 9.67 - t * 0.6);
  return smoothstep(-0.38, 0.68, spiral) * 0.5;
}

/* Reference ramp — singularity.misterprada.com "depth" PostProcess values:
   warm gold at t=0.05 → dark red-brown at t=0.425 → black at t=1.0, boosted
   x2.0 emission before ACES compresses it. Unlike the old Novikov-Thorne
   ramp this fades the disk to black at its outer edge, so the bright band
   stays thin and clear of the hero text. */
vec3 refRamp(float t) {
  vec3 gold = vec3(0.95, 0.71, 0.40);
  vec3 rust = vec3(0.14, 0.05, 0.03);
  vec3 black = vec3(0.0, 0.0, 0.0);
  vec3 col = mix(gold, rust, smoothstep(0.05, 0.425, t));
  return mix(col, black, smoothstep(0.425, 1.0, t));
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
    if (i >= int(uActiveSteps)) break;

    vec3 prevPos = pos;
    float r = length(pos);

    /* adaptive step size — smaller near photon sphere (scaled by s) */
    float stepSize = 0.009 + 0.051 * smoothstep(0.6, 3.0, r);

    /* Schwarzschild deflection: a = -3M · h² · pos / r⁵
       -3M = -1.26 for M = 0.42 */
    vec3 h = cross(pos, rayDir);
    float h2 = dot(h, h);
    vec3 acc = -1.26 * h2 * pos / (r * r * r * r * r + 0.001);

    /* symplectic Euler */
    rayDir = normalize(rayDir + acc * stepSize);
    pos += rayDir * stepSize;

    minR = min(minR, length(pos));

    /* event horizon — analytic sphere test across the whole step segment,
       not just the endpoint sample, so a ray whose curvature carries it
       through RS and back out again within a single integration step is
       still correctly caught as absorbed */
    vec3 segDir = pos - prevPos;
    float segLen = length(segDir);
    bool horizonHit = false;
    if (segLen > 0.0001) {
      segDir /= segLen;
      float b = dot(prevPos, segDir);
      float c = dot(prevPos, prevPos) - RS * RS;
      float disc = b * b - c;
      if (disc >= 0.0) {
        float t = -b - sqrt(disc);
        if (t >= 0.0 && t <= segLen) {
          horizonHit = true;
        }
      }
    }

    if (uDebugMode == 2.0) {
      /* debug mode 2 — force no absorption so the far-side disk arc
         above the shadow is visible in isolation */
    } else if (horizonHit || length(pos) < RS) {
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

      /* Keplerian rotation */
      float angle = atan(hitPos.z, hitPos.x);
      float rotSpeed = 4.8 / (pow(nr, 1.6) + 1.1);
      float rotatedAngle = angle - iTime * rotSpeed * 0.52;

      /* ragged inner silhouette — high-frequency noise perturbs the
         ISCO boundary so the light-wrapping edge is torn, not smooth;
         amplitude + frequency kept modest so the inner/outer arc limbs
         stay on one continuous curve instead of detaching into pieces */
      float edgeNoise = fbm3(vec2(nr * 4.0, rotatedAngle * 10.0));
      float raggedInner = DISK_IN + (edgeNoise - 0.5) * 0.28;

      if (nr > raggedInner && nr < DISK_OUT) {
        float normR = (nr - raggedInner) / (DISK_OUT - raggedInner);

        /* domain-warped fibrous turbulence — high azimuthal frequency
           yields fine hair-like filaments; only evaluated at disk
           crossings, so it never multiplies the per-step ray cost */
        vec2 q = vec2(nr * 3.33, rotatedAngle * 9.5);
        float warpA = noise2D(q * 0.5 + 5.0);
        float warpB = noise2D(q * 0.5 + 17.0);
        q += vec2(warpA, warpB) * 0.55;

        float fibers = 0.0;
        float amp = 0.85;
        vec2 fp = q;
        for (int k = 0; k < 5; k++) {
          fibers += amp * noise2D(fp);
          fp = fp * 1.8 + vec2(warpA * 0.32, warpB * 0.22);
          amp *= 0.55;
        }
        fibers = smoothstep(0.28, 0.78, fibers);

        float noiseFast = fbm(q) * 0.45;
        float noiseSlow = fbm(q * 0.6 + 10.0) * 0.35;
        float vortexValue = vortexPattern(nr, angle, iTime);
        float finalPattern = noiseFast + noiseSlow + fibers * 1.15 + vortexValue * 1.0;

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

        /* disk color from the reference radial ramp (gold → rust → black),
           t = normR (0 at the ragged inner edge, 1 at DISK_OUT). x1.0
           emission keeps the ramp gold/amber-dominant so white survives
           only as a thin inner sliver; the muted olive tint is the
           reference's additive Emission Color */
        vec3 diskCol = refRamp(normR) * 1.0 + vec3(0.14, 0.13, 0.10);

        /* gravitational redshift */
        float gravRedshift = (1.0 / max(gGrav, 0.3) - 1.0) * 0.15;
        diskCol *= vec3(1.0 + gravRedshift, 1.0, 1.0 - gravRedshift * 0.5);

        /* Doppler color shift */
        float dopplerColorShift = doppler * vOrb * 0.1;
        diskCol *= vec3(1.0 + dopplerColorShift, 1.0, 1.0 - dopplerColorShift);

        /* brightness */
        float patternBrightness = (finalPattern + 0.5) * 1.1;
        patternBrightness += pow(max(0.0, finalPattern - 0.5), 1.3) * 0.5;
        float radialBrightness = pow(1.0 - smoothstep(0.0, 0.8, normR), 1.9) * 1.6 + 0.15;
        /* g⁴ beaming compressed for display — the raw 6–10× limb gain
           blows the near band into white before ACES can grade it, so
           map g4 through 0.5 + 0.5·min(g4,4): keeps the limb contrast
           but caps the blowout */
        float beam = 0.5 + 0.5 * min(g4, 4.0);
        float finalBrightness = patternBrightness * radialBrightness * beam;
        /* floor on the Doppler-dimmed receding far side — the g⁴ beam
           crushes it to ~black against the near-black background and
           the ragged noise then reads as a stray dark blob (the
           bottom-left smudge near the mission clock). A small floor
           keeps it a coherent, faint arc instead. */
        finalBrightness = max(finalBrightness, 0.14);

        /* hot core */
        float hotBoost = smoothstep(3.5, 6.0, finalBrightness) * smoothstep(0.0, 0.1, normR);
        diskCol = mix(diskCol, vec3(1.0), hotBoost * 0.3);

        diskCol *= finalBrightness;

        /* sharp disk alpha — tightened ramp window so the outer falloff
           and the inner cutoff both land softly, letting the top/bottom
           lensed arcs blend into the band without a visible seam */
        float innerAlpha = smoothstep(0.0, 0.05, normR);
        float outerAlpha = 1.0 - smoothstep(0.72, 0.92, normR);
        float noiseAlpha = clamp(finalPattern * 0.3 + 0.75, 0.65, 1.0);
        float diskAlpha = innerAlpha * outerAlpha * noiseAlpha;

        col += diskCol * diskAlpha * (1.0 - accAlpha);
        accAlpha += diskAlpha * (1.0 - accAlpha);
        if (accAlpha > 0.99) break;
      }
    }
  }

  /* debug mode 1 — pure absorption mask: absorbed pixels are white,
     everything else black. Bypasses disk, stars, glow and tone mapping. */
  if (uDebugMode == 1.0) {
    gl_FragColor = vec4(vec3(absorbed ? 1.0 : 0.0), 1.0);
    return;
  }

  /* ================================================================
     3. BACKGROUND — stars + photon ring
     ================================================================ */
  if (!absorbed) {
    /* sparse starfield */
    vec2 starUv = uv * 180.0;
    vec2 starCell = floor(starUv);
    float starRand = hash31(vec3(starCell, 1.0));
    if (starRand > 0.992) {
      vec2 starF = fract(starUv) - 0.5;
      float starDist = length(starF);
      float starSize = hash31(vec3(starCell, 2.0)) * 0.22 + 0.08;
      float starBright = smoothstep(starSize, 0.0, starDist);
      vec3 starCol = mix(vec3(0.949, 0.925, 0.878), vec3(1.0, 0.85, 0.6), hash31(vec3(starCell, 3.0)));
      float twinkle = sin(iTime * (starRand * 1.5 + 0.5) + starRand * 62.8) * 0.15 + 0.85;
      col += starCol * starBright * twinkle * (1.0 - accAlpha);
    }

    /* photon ring — falloff and band edges scaled by s (÷0.6) along
       with the world so the halo hugs the smaller shadow */
    float glowDist = minR - RS;
    float photonGlow = exp(-glowDist * 13.33) * 0.15;
    photonGlow *= smoothstep(0.0, 0.03, glowDist) * (1.0 - smoothstep(0.03, 0.3, glowDist));
    col += vec3(1.0, 0.8, 0.4) * photonGlow * (1.0 - accAlpha);

    /* secondary photon ring */
    float secGlow = exp(-glowDist * 5.0) * 0.04;
    secGlow *= smoothstep(0.0, 0.09, glowDist) * (1.0 - smoothstep(0.09, 0.72, glowDist));
    col += vec3(1.0, 0.6, 0.15) * secGlow * (1.0 - accAlpha);
  }

  /* ================================================================
     4. TONE MAPPING — ACES filmic + vignette
     ================================================================ */
  col = acesToneMap(col * 1.05);

  vec2 vigUv = vUv - 0.5;
  col *= 1.0 - dot(vigUv, vigUv) * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`;
}

/* ================================================================
   React component — full-screen quad with shaderMaterial
   ================================================================ */

export default function BlackHole({ reduced, uniformsRef, maxSteps = 256, debugMode = 0 }) {
  const matRef = useRef();
  const fragmentShader = useMemo(() => buildFragmentShader(maxSteps), [maxSteps]);

  const uniforms = useMemo(() => {
    const u = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      uCamPos:     { value: new THREE.Vector3(0, 0, 9.0) },
      uCamRight:   { value: new THREE.Vector3(1, 0, 0) },
      uCamUp:      { value: new THREE.Vector3(0, 1, 0) },
      uCamForward: { value: new THREE.Vector3(0, 0, -1) },
      uActiveSteps:{ value: 256 },
      uDebugMode:  { value: debugMode },
    };
    if (uniformsRef) uniformsRef.current = u;
    return u;
  }, [uniformsRef, debugMode]);

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
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
