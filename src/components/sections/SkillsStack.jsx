import Reveal from "../ui/Reveal";
import { Layout, Code, Database } from "lucide-react";

const skills = [
  {
    title: "Frontend Engineering",
    description: "Building immersive user interfaces using modern frameworks like React, Next.js, and Vite. Expertise in Tailwind CSS and advanced animations with Framer Motion.",
    icon: <Layout className="w-12 h-12 text-primary" />,
    tags: ["HTML", "TailwindCSS", "JavaScript", "React", "Redux"],
  },
  {
    title: "Backend Development",
    description: "Architecting robust server-side applications with Django REST Framework, ORM, and PostgreSQL. Focused on scalability, performance, and secure API design.",
    icon: <Database className="w-12 h-12 text-primary" />,
    tags: ["Django REST Framework", "REST API", "ORM", "PostgreSQL"],
  },
  {
    title: "Programming Languages",
    description: "Building efficient and scalable solutions with a strong command of both back-end and front-end languages — writing clean, maintainable code across the full stack.",
    icon: <Code className="w-12 h-12 text-primary" />,
    tags: ["Python", "JavaScript"],
  },
];

const SkillsStack = () => {
  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto flex flex-col gap-8 relative">
      <Reveal origin="bottom" scale={0.9} distance={30} clip>
        <div className="flex flex-col mb-12">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary-dim mb-2">
            Capabilities
          </span>
          <h3 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-gradient">
            What I do best
          </h3>
        </div>
      </Reveal>

      <div className="flex flex-col gap-10 relative">
        {skills.map((skill, index) => (
          <Reveal key={index} delay={index * 0.15} width="100%" origin="bottom" scale={0.9} distance={30}>
            <div
              className="sticky-card rounded-4xl p-8 md:p-16 flex flex-col md:flex-row gap-8 items-start backdrop-blur-2xl backdrop-saturate-[140%] bg-black/70 border border-white/10 transition-all duration-500 hover:shadow-[0_0_12px_rgba(230,126,34,0.30)] card-shine glow-border"
              style={{ top: `${100 + index * 40}px`, zIndex: index + 1 }}
            >
              <div className="w-full md:w-1/3">
                <div className="mb-6">{skill.icon}</div>
                <h4 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  {skill.title}
                </h4>
                <p className="text-white text-lg leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="w-full md:w-2/3 flex flex-wrap gap-3 mt-4 md:mt-0 justify-start md:justify-end">
                {skill.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-5 py-2 text-sm font-mono font-bold tracking-wider uppercase rounded-full border border-primary-hair text-primary hover:bg-primary/10 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default SkillsStack;
