import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BlackHole from './BlackHole';
import PostEffects from './PostEffects';
import FrameGovernor from './FrameGovernor';
import { RenderGuard } from './RenderControl';

/* ================================================================
   BackgroundScene — fixed camera + scene composition
   Renders: BlackHole (raymarched quad) + PostEffects
   Camera: locked at initial angle, no mouse/orbit/breathing

   Includes the adaptive-quality watchdog: a rolling buffer of frame
   times steps the raymarch tier up/down, keeping frame time within
   budget without flapping (warm-up + cooldown guards).

   On mobile, if the watchdog is pinned at the lowest step rung and
   still over budget, it first steps the render DPR down, then emits
   'bh:too-slow' so the orchestrator can swap to the simple tier.
   ================================================================ */

/* Camera: D=9.0, pitched 0.10 (~5.7°) above the disk plane, rolled
   -0.52 rad (~-30°) around the view axis. Near-edge-on view adapted to
   the wide hero frame as the Interstellar Gargantua "wall of light":
   the single disk-plane crossing (BlackHole.jsx) merges the near-side
   band and the lensed far-side arc into one continuous sheet that
   sweeps diagonally from lower-left to upper-right, instead of a flat
   horizontal ring around the shadow. The shadow itself stays a centered
   circle (M unchanged).

   Black hole scaled DOWN ~0.6x (M=0.42, RS=0.84, deflection -1.26,
   DISK_IN 1.08, DISK_OUT 7.2) so the black event-horizon disk alone is
   ~20-26% of the shorter viewport edge and the full lensed structure
   (disk + photon halo + bloom) stays under ~48% of viewport height with
   visible dark margin on all four sides. Every world-space length in the
   shader was scaled by the same factor (see BlackHole.jsx header), which
   preserves the step budget by construction — distances and step sizes
   shrink together. Step budget at this framing (loop-faithful sim,
   1024×768, cap 400): near-side band max ~221 steps, all <256; the
   far-side arc is a thinner sliver than at DISK_OUT=12 so its >256 tail
   shrinks too. The roll is a rigid rotation of the ray fan around the
   view axis, so it is an isometry — step counts are unchanged by the
   diagonal framing; the pitch bump only adds short-path disk crossings.
   DESKTOP_FLOOR stays 256 to match the deployed site's fixed 256-step
   raymarch. */
const CAM_DISTANCE = 9.0;
const BASE_PITCH = 0.10;
const CAM_ROLL = -0.52;
const CAM_X_OFFSET = 0;
const UP = new THREE.Vector3(0, 1, 0);
const LOOK_AT = new THREE.Vector3(0, 0, 0);

/* adaptive quality ladder — finer rungs on mobile so the watchdog
   can land precisely instead of flapping */
const TIER_LADDER = [64, 128, 192, 224, 256];
const MOBILE_LADDER = [32, 48, 64, 96, 128];
const FRAME_SAMPLES = 15;
const STEP_DOWN_MS = 20;
const STEP_UP_INTERVAL_MS = 4000;
const TIER_COOLDOWN_MS = 2000;

/* desktop never steps below 256 steps — matching the deployed site's
   constant 256-step raymarch so the near-edge-on frame renders identically
   (the far-side arc sliver needs >224, and only the ~305 near-critical
   grazers past 256 truncate, the accepted deployed tail) */
const DESKTOP_FLOOR = 256;

/* sustained-slow detection: how many consecutive frames pinned at the
   bottom rung with avg frame time over budget before degrading */
const DPR_DEGRADE_FRAMES = 90;
const TOO_SLOW_FRAMES = 180;
const DPR_DEGRADE_VALUE = 0.85;

export default function BackgroundScene({ reduced, mobile, maxSteps = 256, frameCap = false, postQuality = 'full', resolutionScale = 1, debugMode = 0 }) {
  const { size } = useThree();
  const setDpr = useThree((s) => s.setDpr);

  const bhUniforms = useRef(null);
  const fixedPos = useRef(null);
  const basisRef = useRef(null);

  const ladder = useMemo(() => {
    const base = mobile ? MOBILE_LADDER : TIER_LADDER;
    const capped = base.filter((s) => s <= maxSteps);
    return capped.length ? capped : [32];
  }, [mobile, maxSteps]);

  const qualityRef = useRef(mobile ? 64 : 256);
  const lastTierChangeRef = useRef(0);
  const frameTimesRef = useRef([]);
  const slowFramesRef = useRef(0);
  const dprDegradedRef = useRef(false);
  const tooSlowFiredRef = useRef(false);

  useFrame((state, delta) => {
    /* clamp delta — browsers report huge deltas after a hidden tab */
    const frameTime = Math.min(delta, 1 / 30) * 1000;

    if (!fixedPos.current) {
      fixedPos.current = new THREE.Vector3(
        CAM_X_OFFSET + CAM_DISTANCE * Math.cos(BASE_PITCH) * Math.sin(0),
        CAM_DISTANCE * Math.sin(BASE_PITCH),
        CAM_DISTANCE * Math.cos(BASE_PITCH) * Math.cos(0)
      );

      const fwd = new THREE.Vector3().copy(LOOK_AT).sub(fixedPos.current).normalize();
      const right = new THREE.Vector3().copy(fwd).cross(UP).normalize();
      if (right.lengthSq() < 0.001) right.set(1, 0, 0);
      const up = new THREE.Vector3().copy(right).cross(fwd).normalize();

      /* roll the basis around the view axis — rotates the whole ray fan
         so the merged near/far disk wall sweeps diagonally (lower-left →
         upper-right) across the wide frame. Pure isometry: no step-budget
         impact. Negative sign makes the left end dip and the right end
         rise in screen space. */
      const rollCos = Math.cos(CAM_ROLL);
      const rollSin = Math.sin(CAM_ROLL);
      const rolledRight = new THREE.Vector3()
        .copy(right).multiplyScalar(rollCos)
        .addScaledVector(up, rollSin);
      const rolledUp = new THREE.Vector3()
        .copy(right).multiplyScalar(-rollSin)
        .addScaledVector(up, rollCos);
      basisRef.current = { fwd, right: rolledRight, up: rolledUp };
    }

    /* adaptive quality watchdog */
    const times = frameTimesRef.current;
    times.push(frameTime);
    if (times.length > FRAME_SAMPLES) times.shift();
    if (times.length >= FRAME_SAMPLES) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const maxFrame = Math.max(...times);
      const now = performance.now();
      const idx = ladder.indexOf(qualityRef.current);
      const atFloor = mobile ? idx === 0 : qualityRef.current <= DESKTOP_FLOOR;

      if (avg > STEP_DOWN_MS && idx > 0 && !atFloor) {
        /* over budget — drop one rung immediately */
        qualityRef.current = ladder[idx - 1];
        lastTierChangeRef.current = now;
      } else if (
        idx < ladder.length - 1 &&
        avg < STEP_DOWN_MS && maxFrame < STEP_DOWN_MS &&
        now - lastTierChangeRef.current > STEP_UP_INTERVAL_MS
      ) {
        /* sustained health — recover one rung. Reachable even at 60Hz:
           a vsync'd 60Hz frame is ~16.7ms, so the old <12ms step-up
           threshold could never trigger and the tier stayed locked at
           the bottom after a single slow frame */
        qualityRef.current = ladder[idx + 1];
        lastTierChangeRef.current = now;
      }

      /* mobile only: sustained-slow escape hatch */
      if (mobile && qualityRef.current === ladder[0] && avg > STEP_DOWN_MS) {
        slowFramesRef.current += 1;
        if (!dprDegradedRef.current && slowFramesRef.current >= DPR_DEGRADE_FRAMES) {
          dprDegradedRef.current = true;
          setDpr(DPR_DEGRADE_VALUE);
        }
        if (!tooSlowFiredRef.current && slowFramesRef.current >= TOO_SLOW_FRAMES) {
          tooSlowFiredRef.current = true;
          window.dispatchEvent(new Event('bh:too-slow'));
        }
      } else {
        slowFramesRef.current = 0;
      }
    }

    const pos = fixedPos.current;
    const basis = basisRef.current;

    state.camera.position.copy(pos);
    state.camera.lookAt(LOOK_AT);
    state.camera.updateMatrixWorld();

    if (bhUniforms.current) {
      const u = bhUniforms.current;
      u.uCamPos.value.copy(pos);
      u.uCamRight.value.copy(basis.right);
      u.uCamUp.value.copy(basis.up);
      u.uCamForward.value.copy(basis.fwd);
      u.iResolution.value.set(size.width, size.height);
      u.uActiveSteps.value = qualityRef.current;
    }
  });

  return (
    <>
      <RenderGuard />
      {frameCap && <FrameGovernor fps={30} />}
      <BlackHole
        reduced={reduced}
        uniformsRef={bhUniforms}
        maxSteps={maxSteps}
        debugMode={debugMode}
      />
      {debugMode !== 1 && <PostEffects quality={postQuality} resolutionScale={resolutionScale} />}
    </>
  );
}
