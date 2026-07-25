import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/* ================================================================
   Post-processing stack — WebGL2 only via @react-three/postprocessing
   Bloom, Vignette, subtle chromatic aberration
   (Noise removed — mod289 shader error crashes GPU process)
   ================================================================ */

export default function PostEffects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        intensity={0.7}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={[0.00015, 0.00015]}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
