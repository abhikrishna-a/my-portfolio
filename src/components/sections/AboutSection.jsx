import Reveal from '../ui/Reveal';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-28 md:py-36 px-6 flex flex-col items-center justify-center text-center bg-secondary border-t border-foreground/10">
      <div className="max-w-4xl">
        <Reveal delay={0.2}>
          <h2 className="stamp stamp-red mb-8">About the Engineer</h2>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="font-display text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
            I'm a designer and developer who cares deeply about{' '}
            <span className="text-primary">the details</span>{' '}
            that solve problems and look beautiful.
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mx-auto mt-10 max-w-xl">
            <p className="text-base md:text-lg font-medium leading-relaxed text-foreground/75">
              Full-stack engineering from the database to the interface — writing clean,
              maintainable code and building products people can use without friction.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              <span className="h-px w-12 bg-foreground/30" />
              <span className="text-primary-dim">— Abhikrishna</span>
              <span className="h-px w-12 bg-foreground/30" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutSection;
