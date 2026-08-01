import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/* ================================================================
   Post-processing stack — WebGL2 only via @react-three/postprocessing
   Bloom, Vignette, subtle chromatic aberration
   (Noise removed — mod289 shader error crashes GPU process)

   quality:
     'full'    — Bloom + Vignette + ChromaticAberration (capable devices)
     'reduced' — lighter Bloom + Vignette only (weak/mobile GPUs)
   resolutionScale cheapens the whole post pass on weak devices.
   ================================================================ */

export default function PostEffects({ quality = 'full', resolutionScale = 1 }) {
  const reduced = quality === 'reduced';
  return (
    <EffectComposer multisampling={0} resolutionScale={resolutionScale}>
      <Bloom
        luminanceThreshold={0.65}
        luminanceSmoothing={0.15}
        intensity={0.24}
        radius={0.45}
        mipmapBlur={false}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      {!reduced && (
        <ChromaticAberration
          offset={[0.00004, 0.00004]}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
}
