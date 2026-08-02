import Reveal from '../ui/Reveal';
import AnimatedCounter from '../ui/AnimatedCounter';

const stats = [
  { to: 20, suffix: '+', label: 'Projects' },
  { to: 100, suffix: '+', label: 'Problems Solved' },
  { to: 10, suffix: '+', label: 'Hours Coding' },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-6 bg-background flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl">
        <Reveal delay={0.2}>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary-dim mb-8 block">
            About Me
          </span>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="font-mono text-3xl md:text-5xl font-black tracking-tight leading-tight">
            I'm a designer and developer who cares deeply about{' '}
            <span className="text-primary italic">crafting digital products</span>{' '}
            that solve problems and look beautiful.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={0.6 + index * 0.1} origin="bottom" distance={30} scale={0.9}>
              <div className="px-8 py-4 rounded-2xl flex flex-col items-center backdrop-blur-2xl backdrop-saturate-[140%] bg-black/70 border border-white/10 transition-all duration-500 hover:shadow-[0_0_12px_rgba(230,126,34,0.30)]">
                <AnimatedCounter
                  to={stat.to}
                  suffix={stat.suffix}
                  className="font-mono text-3xl font-black text-foreground tabular-nums"
                />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary-dim mt-2">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
