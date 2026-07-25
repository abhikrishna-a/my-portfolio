import HeroBackground from '../effects/HeroBackground';
import HudOverlay from '../ui/HudOverlay';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      <HeroBackground />
      <HudOverlay />

      <div
        className="relative z-20 flex flex-col items-center text-center px-6 pointer-events-none"
        style={{ animation: 'introReveal 1.1s cubic-bezier(0.2,0.8,0.2,1) forwards' }}
      >
        <span className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 text-primary">
          Portfolio Transmission
        </span>
        <h1
          className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.08em] uppercase text-foreground"
          style={{
            textShadow: '0 0 40px rgba(230,126,34,0.4), 0 0 80px rgba(230,126,34,0.15), 0 0 120px rgba(230,126,34,0.05)',
          }}
        >
          Abhikrishna
        </h1>
        <p className="mt-6 font-mono text-xs md:text-sm tracking-[0.05em] max-w-[420px] leading-relaxed text-gray-500">
          Engineering interfaces that feel alive, from the database to the pixel that bends light
        </p>

        {/* Signal status indicator */}
        <div className="mt-5 flex items-center gap-2">
          <span
            className="w-[6px] h-[6px] rounded-full bg-primary"
            style={{ animation: 'signalBlink 2s ease-in-out infinite' }}
          />
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-primary">
            Signal Active
          </span>
        </div>

        {/* Sagittarius A* coordinates */}
        <p className="mt-3 font-mono text-[9px] tracking-[0.15em] text-gray-600">
          RA 17h 45m 40.0s / DEC -29&deg; 00&prime; 28.1&Prime;
        </p>
      </div>
    </section>
  );
};

export default Hero;
