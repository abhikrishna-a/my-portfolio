import { useMemo } from 'react';
import useReducedMotion from './useReducedMotion';

/* ================================================================
   VideoBackground — NASA SVS Gargantua 360°-orbit render as the hero
   backdrop. Public domain (svs.gsfc.nasa.gov/14619), H.264, plays in
   every modern browser via hardware decode (no WebGL required).

   Sources are layered: capable desktops get 4K (3840×2160); mobile,
   weak, or low-memory devices fall back to 1080p; reduced-motion and
   no-<video> environments show a static poster instead of playback.
   ================================================================ */

const VIDEO_4K = '/videos/blackhole-4k.mp4';
const VIDEO_1080P = '/videos/blackhole-1080p.mp4';
const POSTER = '/videos/poster.jpg';

function isWeakDevice() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 8;
  const mobile = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
  return mobile || (cores <= 4 && mem <= 4);
}

function canPlayMp4() {
  if (typeof document === 'undefined') return true;
  const v = document.createElement('video');
  return !!v.canPlayType && v.canPlayType('video/mp4').length > 0;
}

export default function VideoBackground() {
  const reduced = useReducedMotion();
  const weak = useMemo(() => isWeakDevice(), []);

  if (reduced || !canPlayMp4()) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: `#020202 url(${POSTER}) center / cover no-repeat` }}
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        disablePictureInPicture
        disableRemotePlayback
      >
        {!weak && <source src={VIDEO_4K} type="video/mp4" />}
        <source src={VIDEO_1080P} type="video/mp4" />
      </video>
      {/* subtle global dim keeps the hero text legible over the bright disk */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
    </div>
  );
}
