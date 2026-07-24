import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   Black Hole Material — fullscreen fragment shader
   Rotating accretion disk with visible angular asymmetry + mouse displacement
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── tunable constants ────────────────────────────────────────────────────── */
const DISK_INNER_FRAC  = 0.38;
const DISK_MID_FRAC    = 0.50;
const DISK_OUTER_FRAC  = 0.70;
const FLARE_INNER_FRAC = 0.36;
const FLARE_OUTER_FRAC = 0.68;
const CORE_BLUR        = 0.012;
const FLARE_BLUR       = 0.035;
const CORE_SPIN_SPEED  = 0.0698;
const FLARE_SPIN_SPEED = -0.1571;
const MOUSE_FALLOFF     = 0.18;
const MOUSE_PUSH        = 0.06;
const MOUSE_SWIRL       = 0.42;
const GRAIN_AMOUNT      = 0.04;
const VIGNETTE_POWER    = 1.6;
const VIGNETTE_RADIUS   = 0.92;

/* ── vertex shader ────────────────────────────────────────────────────────── */
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
uniform vec2  uMouse;
uniform vec2  uMouseVelocity;
uniform float uMouseActive;

varying vec2 vUv;

/* ── colors ───────────────────────────────────────────────────────────────── */
const vec3 BG_CENTER = vec3(0.082, 0.047, 0.020);
const vec3 BG_MID    = vec3(0.020, 0.012, 0.004);
const vec3 AMBER     = vec3(1.0, 0.616, 0.227);
const vec3 AMBER_HOT = vec3(1.0, 0.549, 0.157);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  float t = uTime;

  vec2 centered = uv - 0.5;
  centered.x *= aspect;
  float dist = length(centered);
  float angle = atan(centered.y, centered.x);

  /* ── mouse displacement ─────────────────────────────────────────────────── */
  vec2 toCursor = uv - uMouse;
  toCursor.x *= aspect;
  float distToCursor = length(toCursor);

  float velMag = length(uMouseVelocity);
  float falloff = smoothstep(MOUSE_FALLOFF, 0.0, distToCursor);

  vec2 velDir = normalize(uMouseVelocity + vec2(0.0001));
  vec2 swirlDir = vec2(-velDir.y, velDir.x);
  vec2 outward = normalize(toCursor + vec2(0.0001));

  vec2 displacement = outward * falloff * MOUSE_PUSH
                    + swirlDir * falloff * velMag * MOUSE_SWIRL * 0.1;

  vec2 displacedUV = uv + displacement * uMouseActive;

  vec2 dCentered = displacedUV - 0.5;
  dCentered.x *= aspect;
  float dDist = length(dCentered);
  float dAngle = atan(dCentered.y, dCentered.x);

  /* ── 1. background radial gradient ──────────────────────────────────────── */
  vec3 bg = mix(BG_CENTER, BG_MID, smoothstep(0.0, 0.45, dDist));
  bg = mix(bg, vec3(0.0), smoothstep(0.45, 1.0, dDist));

  /* ── 2. accretion disk ──────────────────────────────────────────────────── */
  float diskBlack = 1.0 - smoothstep(DISK_INNER_FRAC - 0.01, DISK_INNER_FRAC + 0.005, dDist);

  float diskAmber = smoothstep(DISK_INNER_FRAC - 0.005, DISK_INNER_FRAC + 0.02, dDist)
                  * (1.0 - smoothstep(DISK_OUTER_FRAC - 0.02, DISK_OUTER_FRAC + 0.005, dDist));

  float diskEnvelope = smoothstep(DISK_INNER_FRAC, DISK_MID_FRAC, dDist)
                     * (1.0 - smoothstep(DISK_MID_FRAC, DISK_OUTER_FRAC, dDist));
  diskAmber *= diskEnvelope;

  /* ── visible rotation: 2-lobe angular asymmetry ─────────────────────────── */
  float rotMod = sin(dAngle * 2.0 + t * CORE_SPIN_SPEED * 3.0) * 0.3 + 0.7;
  diskAmber *= rotMod;

  /* secondary spiral modulation for depth */
  float spiral = sin(dAngle * 3.0 - t * CORE_SPIN_SPEED * 2.0 + dDist * 8.0) * 0.15 + 0.85;
  diskAmber *= spiral;

  /* disk color */
  vec3 diskColor = mix(AMBER_HOT * 0.55, AMBER * 0.15, smoothstep(DISK_INNER_FRAC, DISK_OUTER_FRAC, dDist));

  vec3 col = mix(bg, vec3(0.0), diskBlack);
  col = mix(col, diskColor, diskAmber);

  /* ── soft disk glow bloom ────────────────────────────────────────────────── */
  float diskGlow = exp(-pow((dDist - DISK_MID_FRAC) * 5.0, 2.0)) * 0.12;
  col += diskGlow * AMBER * rotMod;

  /* ── 3. inner glow ring near horizon ────────────────────────────────────── */
  float innerRim = exp(-pow((dDist - DISK_INNER_FRAC - 0.015) * 18.0, 2.0)) * 0.35;
  col += innerRim * AMBER_HOT;

  /* ── 4. conic flare — boosted opacity ───────────────────────────────────── */
  float flareAngle = dAngle + t * FLARE_SPIN_SPEED;
  float degAngle = mod(degrees(flareAngle) + 360.0, 360.0);

  float band1 = smoothstep(0.0, 40.0, degAngle) * smoothstep(90.0, 40.0, degAngle);
  float band2 = smoothstep(200.0, 250.0, degAngle) * smoothstep(300.0, 250.0, degAngle);

  float flareStrength = (band1 * 0.55 + band2 * 0.40);

  float flareZone = smoothstep(FLARE_INNER_FRAC, FLARE_INNER_FRAC + 0.08, dDist)
                  * smoothstep(FLARE_OUTER_FRAC, FLARE_OUTER_FRAC - 0.08, dDist);
  flareStrength *= flareZone;

  col += flareStrength * AMBER;

  /* ── 5. blur approximation ──────────────────────────────────────────────── */
  float coreBlurAcc = 0.0;
  vec2 cOff = vec2(CORE_BLUR / aspect, CORE_BLUR) * 0.5;
  for (int i = 0; i < 4; i++) {
    vec2 off = cOff * vec2(
      float(i == 0) - float(i == 1),
      float(i == 2) - float(i == 3)
    );
    vec2 sUV = displacedUV + off;
    vec2 sC = sUV - 0.5;
    sC.x *= aspect;
    float sD = length(sC);
    coreBlurAcc += smoothstep(DISK_INNER_FRAC - 0.005, DISK_INNER_FRAC + 0.02, sD)
                 * (1.0 - smoothstep(DISK_OUTER_FRAC - 0.02, DISK_OUTER_FRAC + 0.005, sD));
  }
  coreBlurAcc *= 0.25;

  float flareBlurAcc = 0.0;
  vec2 fOff = vec2(FLARE_BLUR / aspect, FLARE_BLUR);
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.0472;
    vec2 off = vec2(cos(a), sin(a)) * fOff * 0.5;
    vec2 sUV = displacedUV + off;
    vec2 sC = sUV - 0.5;
    sC.x *= aspect;
    float sD = length(sC);
    float sA = atan(sC.y, sC.x);
    float sDeg = mod(degrees(sA + t * FLARE_SPIN_SPEED) + 360.0, 360.0);
    float b1 = smoothstep(0.0, 40.0, sDeg) * smoothstep(90.0, 40.0, sDeg);
    float b2 = smoothstep(200.0, 250.0, sDeg) * smoothstep(300.0, 250.0, sDeg);
    float fz = smoothstep(FLARE_INNER_FRAC, FLARE_INNER_FRAC + 0.08, sD)
             * smoothstep(FLARE_OUTER_FRAC, FLARE_OUTER_FRAC - 0.08, sD);
    flareBlurAcc += (b1 * 0.55 + b2 * 0.40) * fz;
  }
  flareBlurAcc *= 0.1667;

  col -= flareStrength * AMBER;
  col += flareBlurAcc * AMBER;

  /* ── 6. grain ────────────────────────────────────────────────────────────── */
  float g = (hash(gl_FragCoord.xy + t * 97.0) - 0.5) * GRAIN_AMOUNT;
  col += g;

  /* ── 7. vignette ─────────────────────────────────────────────────────────── */
  float vig = 1.0 - smoothstep(VIGNETTE_RADIUS * 0.5, VIGNETTE_RADIUS, length(uv - 0.5));
  col *= pow(vig, VIGNETTE_POWER);

  /* ── 8. ambient outer glow ───────────────────────────────────────────────── */
  float ambient = exp(-dDist * 3.0) * 0.04;
  col += ambient * AMBER_HOT * 0.3;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export function createBlackHoleMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uTime:            { value: 0 },
      uResolution:      { value: new THREE.Vector2(1, 1) },
      uMouse:           { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity:   { value: new THREE.Vector2(0, 0) },
      uMouseActive:     { value: 0 },
    },
  });
}
