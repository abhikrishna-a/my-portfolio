import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BlackHole from './BlackHole';
import ParticleField from './ParticleField';
import PostEffects from './PostEffects';

/* ================================================================
   BackgroundScene — fixed camera + scene composition
   Renders: BlackHole (raymarched quad) + Planet + ParticleField + PostEffects
   Camera: locked at initial angle, no mouse/orbit/breathing
   ================================================================ */

const CAM_DISTANCE = 9.0;
const BASE_PITCH   = 0.05;
const UP = new THREE.Vector3(0, 1, 0);
const LOOK_AT = new THREE.Vector3(0, 0, 0);

/* planet orbit params */
const PLANET_ORBIT_RADIUS = 3.8;
const PLANET_ORBIT_SPEED  = 0.08;
const PLANET_SIZE = 0.18;

export default function BackgroundScene({ reduced }) {
  const { size } = useThree();

  const startTime = useRef(performance.now());

  const bhUniforms = useRef(null);
  const planetRef = useRef();

  const fixedPos = useRef(null);
  const basisRef = useRef(null);

  useFrame((state, delta) => {
    const elapsed = (performance.now() - startTime.current) * 0.001;

    if (!fixedPos.current) {
      fixedPos.current = new THREE.Vector3(
        CAM_DISTANCE * Math.cos(BASE_PITCH) * Math.sin(0),
        CAM_DISTANCE * Math.sin(BASE_PITCH),
        CAM_DISTANCE * Math.cos(BASE_PITCH) * Math.cos(0)
      );

      const fwd = new THREE.Vector3().copy(LOOK_AT).sub(fixedPos.current).normalize();
      const right = new THREE.Vector3().copy(fwd).cross(UP).normalize();
      if (right.lengthSq() < 0.001) right.set(1, 0, 0);
      const up = new THREE.Vector3().copy(right).cross(fwd).normalize();
      basisRef.current = { fwd, right, up };
    }

    const pos = fixedPos.current;
    const basis = basisRef.current;

    state.camera.position.copy(pos);
    state.camera.lookAt(LOOK_AT);
    state.camera.updateMatrixWorld();

    if (planetRef.current) {
      const angle = elapsed * PLANET_ORBIT_SPEED + Math.PI;
      planetRef.current.position.set(
        PLANET_ORBIT_RADIUS * Math.cos(angle),
        Math.sin(elapsed * 0.05) * 0.05,
        PLANET_ORBIT_RADIUS * Math.sin(angle)
      );
    }

    if (bhUniforms.current) {
      const u = bhUniforms.current;
      u.uCamPos.value.copy(pos);
      u.uCamRight.value.copy(basis.right);
      u.uCamUp.value.copy(basis.up);
      u.uCamForward.value.copy(basis.fwd);
      u.iResolution.value.set(size.width, size.height);
    }
  });

  return (
    <>
      <BlackHole
        reduced={reduced}
        uniformsRef={bhUniforms}
      />

      {/* Orbiting planet — dark, shadowy, silhouetted against the disk */}
      <mesh ref={planetRef} position={[-PLANET_ORBIT_RADIUS, 0, 0]} renderOrder={2}>
        <sphereGeometry args={[PLANET_SIZE, 32, 16]} />
        <meshBasicMaterial color="#0a0a12" />
      </mesh>

      <ParticleField reduced={reduced} />
      <PostEffects />
    </>
  );
}
