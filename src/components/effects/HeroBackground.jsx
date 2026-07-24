import BlackHoleHero from './BlackHoleHero';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <BlackHoleHero />
    </div>
  );
}
