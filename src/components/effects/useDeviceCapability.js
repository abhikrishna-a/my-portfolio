import { useState, useEffect } from 'react';

export default function useDeviceCapability() {
  const [cap, setCap] = useState(() => detect());

  useEffect(() => {
    setCap(detect());
  }, []);

  return cap;
}

function detect() {
  if (typeof window === 'undefined') {
    return { webgl2: true, quality: 'high', lowTier: false };
  }

  let webgl2 = false;
  try {
    const c = document.createElement('canvas');
    webgl2 = !!c.getContext('webgl2');
  } catch {
    webgl2 = false;
  }

  const cores = navigator.hardwareConcurrency || 4;
  const isTouch = 'ontouchstart' in window;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const smallScreen = window.innerWidth < 768;
  const lowTier = (cores <= 4 && isTouch) || !webgl2;

  let quality = 'high';
  if (!webgl2) {
    quality = 'low';
  } else if (cores <= 4 && isTouch) {
    quality = 'low';
  } else if (isTouch && smallScreen && !isFinePointer) {
    quality = 'low';
  }

  return { webgl2, quality, lowTier };
}
