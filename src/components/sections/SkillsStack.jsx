import Reveal from "../ui/Reveal";
import { Layout, Code, Database } from "lucide-react";

const skills = [
  {
    spec: "SPEC 01",
    title: "Frontend Engineering",
    description: "Building immersive user interfaces using modern frameworks like React, Next.js, and Vite. Expertise in Tailwind CSS and advanced animations with Framer Motion.",
    icon: <Layout className="w-10 h-10 text-primary" />,
    tags: ["HTML", "TailwindCSS", "JavaScript", "React", "Redux"],
  },
  {
    spec: "SPEC 02",
    title: "Backend Development",
    description: "Architecting robust server-side applications with Django REST Framework, ORM, and PostgreSQL. Focused on scalability, performance, and secure API design.",
    icon: <Database className="w-10 h-10 text-primary" />,
    tags: ["Django REST Framework", "REST API", "ORM", "PostgreSQL"],
  },
  {
    spec: "SPEC 03",
    title: "Programming Languages",
    description: "Building efficient and scalable solutions with a strong command of both back-end and front-end languages — writing clean, maintainable code across the full stack.",
    icon: <Code className="w-10 h-10 text-primary" />,
    tags: ["Python", "JavaScript"],
  },
];

const SkillsStack = () => {
  return (
    <section id="skills" className="relative py-20 md:py-28 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
        <Reveal origin="bottom" scale={0.98} distance={24}>
          <div className="relative mb-12 max-w-3xl">
            <div className="absolute -top-4 left-8 w-24 h-6 tape -rotate-2" aria-hidden="true" />
            <h2 className="ledger-head font-display text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
              What I do best
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8 relative">
          {skills.map((skill, index) => (
            <Reveal key={skill.spec} delay={index * 0.1} width="100%" origin="bottom" scale={0.98} distance={24}>
              <div
                className="sticky-card rounded-[0.9rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start bg-card border border-foreground/15 transition-all duration-500 motion-safe:hover:-translate-y-1 hover:border-primary/45 card-shine"
                style={{ top: `${100 + index * 40}px`, zIndex: index + 1 }}
              >
                <div className="w-full md:w-1/3">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-md border-[1.5px] border-primary/40 bg-background">
                      {skill.icon}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-amber">
                      {skill.spec}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 tracking-tight uppercase">
                    {skill.title}
                  </h3>
                  <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="w-full md:w-2/3 flex flex-wrap gap-3 mt-4 md:mt-0 justify-start md:justify-end content-start">
                  {skill.tags.map(tag => (
                    <span
                      key={tag}
                      className="tag-sweep px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-[4px] border border-primary/40 text-primary transition-colors duration-300 hover:bg-primary/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsStack;
