import Starfield from './Starfield';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Starfield
        count={650}
        shootingRange={[0.7, 1.2]}
        starScale={1.2}
        lensStrength={0.4}
        lensRadius={260}
        maxShooters={5}
        className="absolute inset-0 pointer-events-none"
      />
      {/* Nebula tint: sky-blue corners, warm center — adds complementary
          depth over the starfield */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 90% 60% at 12% 12%, rgba(56,189,248,0.14), transparent 50%)',
            'radial-gradient(ellipse 80% 55% at 88% 90%, rgba(56,189,248,0.10), transparent 50%)',
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,126,34,0.10), transparent 70%)',
          ].join(', '),
        }}
      />
    </div>
  );
}
