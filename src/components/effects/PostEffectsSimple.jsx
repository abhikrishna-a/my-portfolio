import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

/* ================================================================
   PostEffectsSimple — cinematic post-processing for simple Three.js
   Same effects as the GLSL version, tuned for particle-based scene
   ================================================================ */

export default function PostEffectsSimple() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.92}
        luminanceSmoothing={0.15}
        intensity={0.5}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={[0.0002, 0.0002]}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
