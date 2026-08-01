import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BlackHoleSimple from './BlackHoleSimple';
import StarDome from './StarDome';
import PostEffectsSimple from './PostEffectsSimple';
import FrameGovernor from './FrameGovernor';
import { RenderGuard } from './RenderControl';

const CAM_DISTANCE = 7.0;
const BASE_PITCH   = 0.35;
const LOOK_AT = new THREE.Vector3(0, 0, 0);
const UP = new THREE.Vector3(0, 1, 0);

export default function BackgroundSceneSimple({ reduced, frameCap = false }) {
  const { size } = useThree();
  const startTime = useRef(performance.now());

  const fixedPos = useRef(null);
  const basisRef = useRef(null);
  const breathFov = useRef(55);

  useFrame((state) => {
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

    if (!reduced) {
      breathFov.current = 55 + Math.sin(elapsed * 0.3) * 1.5;
      state.camera.fov = breathFov.current;
      state.camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <RenderGuard />
      {frameCap && <FrameGovernor fps={30} />}
      <BlackHoleSimple reduced={reduced} />
      <StarDome reduced={reduced} />
      <PostEffectsSimple resolutionScale={0.75} />
    </>
  );
}
