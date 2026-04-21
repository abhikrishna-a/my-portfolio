import { useEffect } from 'react';
import Lenis from 'lenis';

const useSmoothScroll = () => {
  useEffect(() => {
    // Wait for preloader to finish before initializing Lenis
    const timer = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: true,
        lerp: 0.1,
        prevent: (node) => {
          return node.classList && node.classList.contains('lenis-prevent');
        }
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Link Lenis to scroll links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            lenis.scrollTo(targetElement);
          }
        });
      });

      return () => {
        lenis.destroy();
      };
    }, 1000); // Start after preloader finishes

    return () => clearTimeout(timer);
  }, []);
};

export default useSmoothScroll;