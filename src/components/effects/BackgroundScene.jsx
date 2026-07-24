import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BlackHole from './BlackHole';
import ParticleField from './ParticleField';
import PostEffects from './PostEffects';

/* ================================================================
   BackgroundScene — camera orbit + scene composition
   Renders: BlackHole (raymarched quad) + ParticleField + PostEffects
   Camera: slow auto-orbit near edge-on, mouse-influenced, breathing
   ================================================================ */

const CAM_DISTANCE = 5.6;
const ORBIT_SPEED  = 0.03;   /* radians per second */
const BASE_PITCH   = 0.05;   /* ~3° — nearly edge-on */
const MOUSE_YAW_RANGE   = 0.3;
const MOUSE_PITCH_RANGE = 0.15;
const BREATH_AMP = 0.02;
const BREATH_FREQ = 0.3;
const UP = new THREE.Vector3(0, 1, 0);
const LOOK_AT = new THREE.Vector3(0, 0, 0);

export default function BackgroundScene({ mouse, reduced }) {
  const { size } = useThree();

  /* camera state refs — zero React re-renders */
  const camYaw   = useRef(0);
  const camPitch = useRef(BASE_PITCH);
  const camBreath = useRef(0);
  const startTime = useRef(performance.now());

  /* reusable vectors to avoid allocation */
  const _pos    = useRef(new THREE.Vector3());
  const _target = useRef(new THREE.Vector3(0, 0, 0));
  const _right  = useRef(new THREE.Vector3());
  const _up     = useRef(new THREE.Vector3());
  const _fwd    = useRef(new THREE.Vector3());

  /* BlackHole uniforms ref — written directly each frame */
  const bhUniforms = useRef(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const elapsed = (performance.now() - startTime.current) * 0.001;
    const isReduced = reduced;

    /* ── mouse influence on yaw + pitch ── */
    const mx = mouse.data.current.x;
    const my = mouse.data.current.y;
    const targetYaw = isReduced ? 0 : mx * MOUSE_YAW_RANGE;
    const targetPitch = isReduced ? BASE_PITCH : BASE_PITCH + my * MOUSE_PITCH_RANGE;
    const mK = 1 - Math.exp(-2.5 * dt);

    /* ── camera orbit: spring-ease toward target + slow auto-orbit offset ── */
    if (!isReduced) {
      camYaw.current += dt * ORBIT_SPEED;
    }
    const yawDelta = (targetYaw - camYaw.current) * mK;
    const pitchDelta = (targetPitch - camPitch.current) * mK;
    camYaw.current += yawDelta;
    camPitch.current += pitchDelta;

    /* ── breathing — tiny sinusoidal drift ── */
    if (!isReduced) {
      camBreath.current = Math.sin(elapsed * BREATH_FREQ) * BREATH_AMP;
    }

    /* ── compute camera position from spherical coords ── */
    const yaw = camYaw.current;
    const pitch = camPitch.current + camBreath.current;
    const pos = _pos.current;
    pos.set(
      CAM_DISTANCE * Math.cos(pitch) * Math.sin(yaw),
      CAM_DISTANCE * Math.sin(pitch),
      CAM_DISTANCE * Math.cos(pitch) * Math.cos(yaw)
    );

    /* ── compute camera basis vectors ── */
    const target = _target.current;
    const fwd = _fwd.current;
    const right = _right.current;
    const up = _up.current;

    fwd.copy(target).sub(pos).normalize();
    right.copy(fwd).cross(UP).normalize();
    if (right.lengthSq() < 0.001) right.set(1, 0, 0);
    up.copy(right).cross(fwd).normalize();

    /* ── apply camera to Three.js (for ParticleField + PostEffects) ── */
    state.camera.position.copy(pos);
    state.camera.lookAt(LOOK_AT);
    state.camera.updateMatrixWorld();

    /* ── write camera basis into BlackHole uniforms ── */
    if (bhUniforms.current) {
      const u = bhUniforms.current;
      u.uCamPos.value.copy(pos);
      u.uCamRight.value.copy(right);
      u.uCamUp.value.copy(up);
      u.uCamForward.value.copy(fwd);
      u.iResolution.value.set(size.width, size.height);
    }
  });

  return (
    <>
      {/* BlackHole — the raymarched quad.
          We use a ref callback to capture its uniforms for BackgroundScene to write into. */}
      <BlackHole
        mouse={mouse}
        trailArray={mouse.trailArray}
        trailCount={mouse.trailCount}
        reduced={reduced}
        uniformsRef={bhUniforms}
      />
      <ParticleField reduced={reduced} />
      <PostEffects />
    </>
  );
}
