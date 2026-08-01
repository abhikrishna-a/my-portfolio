import { createContext, useContext, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/* ================================================================
   RenderControl — single source of truth for the render loop

   RenderContext: provided OUTSIDE <Canvas> by BlackHoleHeroInner.
   R3F bridges React context into its reconciler tree via
   its-fine's useContextBridge (CanvasImpl calls it internally),
   so RenderGuard (inside the Canvas) can read it with useContext.

   RenderGuard:
     - drives setFrameloop('always'|'never') from the consolidated
       shouldRender boolean — this genuinely halts GPU rendering,
       not just skips useFrame logic
     - reports WebGL context loss/restore up to the orchestrator
       via window events so it can remount the Canvas
   ================================================================ */

export const RenderContext = createContext({ shouldRender: true });

export function RenderGuard() {
  const { shouldRender } = useContext(RenderContext);
  const gl = useThree((s) => s.gl);
  const setFrameloop = useThree((s) => s.setFrameloop);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[RenderGuard] frameloop ->', shouldRender ? 'always' : 'never');
    }
    setFrameloop(shouldRender ? 'always' : 'never');
  }, [shouldRender, setFrameloop]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (e) => {
      e.preventDefault();
      window.dispatchEvent(new Event('bh:context-lost'));
    };
    const onContextRestored = () => {
      window.dispatchEvent(new Event('bh:context-restored'));
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
    };
  }, [gl]);

  return null;
}
