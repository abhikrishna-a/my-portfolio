import * as THREE from 'three';

/* ── tuning constants ─────────────────────────────────────────────────────── */
const TRAIL_LENGTH = 24;
const DEFAULT_AMBIENT_SPEED = 0.02;
const DEFAULT_INTERACTION_STRENGTH = 1.0;
const DEFAULT_INTERACTION_RADIUS = 0.12;
const DEFAULT_GRAIN_AMOUNT = 0.02;
const DEFAULT_DECAY = 0.99;

/* ── vertex shader — big triangle fullscreen technique ────────────────────── */
const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
  vUv = position.xy * 0.5 + 0.5;
}
`;

/* ── fragment shader ──────────────────────────────────────────────────────── */
const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uPointer;
uniform vec2  uPointerVelocity;
uniform float uPointerVelocityMagnitude;
uniform float uPointerActive;
uniform vec2  uPointerTrail[${TRAIL_LENGTH}];
uniform float uPointerTrailAge[${TRAIL_LENGTH}];
uniform float uGrainAmount;
uniform float uReducedMotion;
uniform float uAmbientSpeed;
uniform float uInteractionStrength;
uniform float uInteractionRadius;
uniform float uQuality;

varying vec2 vUv;

/* ── tuning (mirrored from JS) ───────────────────────────────────────────── */
#define TRAIL_LEN      ${TRAIL_LENGTH}
#define PTR_RADIUS     ${DEFAULT_INTERACTION_RADIUS.toFixed(2)}
#define PTR_DECAY      1.5
#define PI             3.14159265359
#define FBM_OCTAVES    4

/* ═══════════════════════════════════════════════════════════════════════════
   3D Simplex Noise — Ashima Arts / Ian McEwan & Stefan Gustavson
   ═══════════════════════════════════════════════════════════════════════════ */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x  = x_ * ns.x + ns.yyyy;
  vec4 y  = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Curl Noise — divergence-free vector field from scalar noise gradient.
   Produces swirling, non-crossing flow lines (like fluid/smoke).
   ═══════════════════════════════════════════════════════════════════════════ */
vec2 curlNoise(vec2 p, float t) {
  float e = 0.01;
  float n1 = snoise(vec3(p.x,     p.y + e, t));
  float n2 = snoise(vec3(p.x,     p.y - e, t));
  float n3 = snoise(vec3(p.x + e, p.y,     t));
  float n4 = snoise(vec3(p.x - e, p.y,     t));
  return vec2((n1 - n2) / (2.0 * e), (n4 - n3) / (2.0 * e));
}

/* ═══════════════════════════════════════════════════════════════════════════
   fBm — fractal Brownian motion for ribbon detail.
   4 octaves of curl noise at increasing frequency / decreasing amplitude.
   ═══════════════════════════════════════════════════════════════════════════ */
float fbmCurl(vec2 p, float t, int octaves) {
  float v = 0.0;
  float a = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    vec2 curled = curlNoise(p * freq, t);
    v += a * length(curled);
    freq *= 2.01;
    t *= 1.08;
    a *= 0.5;
  }
  return v;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Domain-Warped Flow — 3 nested warp passes for silk ribbon shapes.
   Each warp bends the sampling coordinate, creating elongated folding strands.
   ═══════════════════════════════════════════════════════════════════════════ */
float warpedFlow(vec2 uv, float time, float scale, float warpStr, int octaves) {
  vec2 p = uv * scale;
  vec2 w1 = curlNoise(p, time * 0.3);
  vec2 w2 = curlNoise(p * 1.8 + w1 * warpStr, time * 0.4 + 10.0);
  vec2 field = curlNoise(p * 3.0 + w2 * warpStr * 1.2, time * 0.5 + 20.0);
  float ribbon = length(field);
  ribbon += fbmCurl(p * 2.0 + w2 * 0.3, time * 0.35 + 30.0, octaves) * 0.3;
  return ribbon;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Color Ramp — warm ember palette.
   Black → dark ember red → burnt orange → amber/gold → bright highlight.
   ═══════════════════════════════════════════════════════════════════════════ */
vec3 emberColor(float t) {
  vec3 c0 = vec3(0.000, 0.000, 0.000); // #000000 black
  vec3 c1 = vec3(0.227, 0.059, 0.008); // #3a0f02 dark ember
  vec3 c2 = vec3(0.702, 0.255, 0.047); // #b3410c burnt orange
  vec3 c3 = vec3(0.910, 0.537, 0.102); // #e8891a amber
  vec3 c4 = vec3(1.000, 0.824, 0.478); // #ffd27a bright highlight
  vec3 c5 = vec3(1.000, 0.953, 0.839); // #fff3d6 near-white-gold

  float s = t * 5.0;
  vec3 col = c0;
  col = mix(col, c1, smoothstep(0.0, 1.0, s - 0.0));
  col = mix(col, c2, smoothstep(0.0, 1.0, s - 1.0));
  col = mix(col, c3, smoothstep(0.0, 1.0, s - 2.0));
  col = mix(col, c4, smoothstep(0.0, 1.0, s - 3.0));
  col = mix(col, c5, smoothstep(0.0, 1.0, s - 4.0));
  return col;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Film Grain — prevents banding in dark gradients.
   ═══════════════════════════════════════════════════════════════════════════ */
float grain(vec2 fragCoord, float time) {
  return (fract(sin(dot(fragCoord + time, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 2.0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main
   ═══════════════════════════════════════════════════════════════════════════ */
void main() {
  float speed = uAmbientSpeed;
  float animTime = mix(uTime * speed, uTime * speed * 0.05, uReducedMotion);
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);
  int octaves = int(mix(float(FBM_OCTAVES), 2.0, 1.0 - uQuality));

  /* ── pointer disturbance with trailing wake ─────────────────────────── */
  vec2 disturbance = vec2(0.0);
  float glowAccum = 0.0;
  float velMag = min(uPointerVelocityMagnitude, 5.0);
  float iStr = uInteractionStrength;
  float iRad = uInteractionRadius;

  for (int i = 0; i < TRAIL_LEN; i++) {
    float age = uPointerTrailAge[i];
    if (age > 3.0) continue;

    vec2 sampleAspect = vec2(uPointerTrail[i].x * aspect, uPointerTrail[i].y);
    vec2 toPtr = uvAspect - sampleAspect;
    float dist = length(toPtr);
    float radius = iRad + velMag * 0.02;
    float falloff = smoothstep(radius, 0.0, dist);
    float decay = exp(-age / PTR_DECAY);

    disturbance += toPtr * falloff * decay * 0.02 * iStr;
    glowAccum += falloff * decay * 0.3;
  }

  vec2 disturbedUV = clamp(uv + disturbance, 0.0, 1.0);

  /* ── 3-layer domain-warped curl noise ───────────────────────────────── */
  vec2 disturbedAspect = vec2(disturbedUV.x * aspect, disturbedUV.y);

  float backVal = warpedFlow(disturbedAspect, animTime, 1.5, 0.4, octaves);
  float midVal  = warpedFlow(disturbedAspect, animTime + 5.0, 3.0, 0.5, octaves);
  float frontVal = warpedFlow(disturbedAspect, animTime + 12.0, 5.0, 0.6, octaves);

  float combined = 1.0 - (1.0 - backVal * 0.30)
                       * (1.0 - midVal  * 0.50)
                       * (1.0 - frontVal * 0.70);

  /* thin bright cores via pow — silk-strand ridges */
  float core = pow(combined, 2.2);
  float edge = combined * 0.6;
  float noiseMag = core + edge;

  /* ── color mapping ──────────────────────────────────────────────────── */
  float colorT = clamp(noiseMag * 0.85, 0.0, 1.0);
  vec3 col = emberColor(colorT);

  /* boost brightness where strands overlap (additive glow) */
  col *= noiseMag * 2.5 + 0.08;

  /* warm ambient glow from pointer */
  col += glowAccum * vec3(1.0, 0.65, 0.25) * 0.4 * iStr;

  /* specular hotspots — tiny bright kernels at silk crests */
  float specPow = pow(noiseMag, 6.0) * 0.4;
  col += specPow * vec3(1.0, 0.95, 0.88);

  /* ── in-shader bloom (cheap) — sample main density at blurred offsets ──── */
  if (uQuality > 0.5) {
    float bloomOff = 0.006;
    float b = 0.0;
    b += pow(length(curlNoise(disturbedAspect * 3.0 + vec2( bloomOff, 0.0), animTime * 0.5)), 2.0);
    b += pow(length(curlNoise(disturbedAspect * 3.0 + vec2(-bloomOff, 0.0), animTime * 0.5)), 2.0);
    b += pow(length(curlNoise(disturbedAspect * 3.0 + vec2(0.0,  bloomOff), animTime * 0.5)), 2.0);
    b += pow(length(curlNoise(disturbedAspect * 3.0 + vec2(0.0, -bloomOff), animTime * 0.5)), 2.0);
    b *= 0.25;
    col += b * vec3(0.9, 0.5, 0.2) * 0.3;
  }

  /* ── film grain ──────────────────────────────────────────────────────── */
  float g = grain(gl_FragCoord.xy, uTime * 0.3) * uGrainAmount;
  col += g;

  /* ── alpha: soft vignette ────────────────────────────────────────────── */
  float vig = smoothstep(0.0, 0.6, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));

  gl_FragColor = vec4(col, vig);
}
`;

/* ── material factory ─────────────────────────────────────────────────────── */
export function createEmberSilkMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTime:                     { value: 0 },
      uResolution:               { value: new THREE.Vector2(1, 1) },
      uPointer:                  { value: new THREE.Vector2(0.5, 0.5) },
      uPointerVelocity:          { value: new THREE.Vector2(0, 0) },
      uPointerVelocityMagnitude: { value: 0 },
      uPointerActive:            { value: 0 },
      uPointerTrail:             { value: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(0.5, 0.5)) },
      uPointerTrailAge:          { value: new Float32Array(TRAIL_LENGTH).fill(999) },
      uGrainAmount:              { value: DEFAULT_GRAIN_AMOUNT },
      uReducedMotion:            { value: 0 },
      uAmbientSpeed:             { value: DEFAULT_AMBIENT_SPEED },
      uInteractionStrength:      { value: DEFAULT_INTERACTION_STRENGTH },
      uInteractionRadius:        { value: DEFAULT_INTERACTION_RADIUS },
      uQuality:                  { value: 1.0 },
    },
  });
}

export { TRAIL_LENGTH };
