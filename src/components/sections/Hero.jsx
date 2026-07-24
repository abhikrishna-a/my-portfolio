import { useState, useEffect } from 'react';
import StarfieldNebula from '../three/StarfieldNebula';
import HudOverlay from '../ui/HudOverlay';

const Hero = () => {
  const [introVisible, setIntroVisible] = useState(true);
  const [introPhase, setIntroPhase] = useState('kicker');

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('name'), 1200);
    const t2 = setTimeout(() => setIntroPhase('subtitle'), 2400);
    const t3 = setTimeout(() => setIntroVisible(false), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      <StarfieldNebula />
      <HudOverlay />

      <div className="relative z-20 flex flex-col items-center text-center px-6">
        {introVisible && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            {introPhase === 'kicker' && (
              <span className="font-mono text-xs tracking-[0.5em] uppercase text-primary animate-fadeIn">
                Portfolio
              </span>
            )}
            {introPhase === 'name' && (
              <h1
                className="font-mono text-4xl md:text-6xl font-black tracking-[0.36em] uppercase text-white animate-scaleUp"
                style={{
                  paddingLeft: '0.36em',
                  textShadow: '0 0 18px rgba(230,126,34,0.55), 0 0 46px rgba(230,126,34,0.30)',
                }}
              >
                Abhikrishna
              </h1>
            )}
            {introPhase === 'subtitle' && (
              <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary-dim animate-fadeIn">
                Full Stack Developer
              </p>
            )}
          </div>
        )}

        {!introVisible && (
          <div className="flex flex-col items-center">
            <h1
              className="font-mono text-3xl md:text-4xl lg:text-5xl font-black tracking-[0.42em] uppercase text-white"
              style={{
                paddingLeft: '0.42em',
                textShadow: '0 0 18px rgba(230,126,34,0.55), 0 0 46px rgba(230,126,34,0.30)',
                animation: 'introCard 5.2s ease forwards',
              }}
            >
              Abhikrishna
            </h1>

            <p
              className="mt-6 font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-primary-dim"
              style={{ textShadow: '0 0 14px rgba(230,126,34,0.35)' }}
            >
              Full Stack Developer
            </p>

            <div className="mt-10 w-16 h-px bg-primary-hair" />

            <div className="mt-16 flex flex-col items-center animate-glowPulse">
              <div className="w-5 h-8 border border-primary-hair rounded-full p-1 flex justify-center">
                <div className="w-1 h-2 bg-primary rounded-full animate-scrollDot" />
              </div>
              <span className="mt-3 font-mono text-[9px] tracking-[0.2em] uppercase text-primary-dim">
                Scroll
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
