import Reveal from "../ui/Reveal";
import { Layout, Codepen, Globe, Database, Smartphone, Palette, Code } from "lucide-react";

const skills = [
  {
    title: "Frontend Engineering",
    description: "Building immersive user interfaces using modern frameworks like React, Next.js, and Vite. Expertise in Tailwind CSS and advanced animations with Framer Motion.",
    icon: <Layout className="w-12 h-12 text-primary" />,
    color: "bg-card",
    tags: ["HTML","TailwindCSS","JavaScript", "React", "Redux"],
  },
  {
    title: "Backend Development",
    description: "Architecting robust server-side applications with Django REST Framework, ORM, and PostgreSQL. Focused on scalability, performance, and secure API design.",
    icon: <Database className="w-12 h-12 text-primary" />,
    color: "bg-card",
    tags: ["Django REST Framework", "REST API", "ORM", "PostgreSQL"],
  },
  {
    title: "Programming Languages",
    description: "Building efficient and scalable solutions with a strong command of both back-end and front-end languages � writing clean, maintainable code across the full stack.",
    icon: <Code className="w-12 h-12 text-primary" />,
    color: "bg-card",
    tags: ["Python", "JavaScript"],
  },
];

const SkillsStack = () => {
  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto flex flex-col gap-8 relative">
      <Reveal>
        <div className="flex flex-col mb-12">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">Capabilities</h2>
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter">What I do best</h3>
        </div>
      </Reveal>

      <div className="flex flex-col gap-10 relative">
        {skills.map((skill, index) => (
          <Reveal key={index} delay={index * 0.15} width="100%">
            <div
              className={`sticky-card ${skill.color} border border-gray-200 rounded-4xl p-8 md:p-16 shadow-lg flex flex-col md:flex-row gap-8 items-start transition-all duration-500 hover:shadow-2xl`}
              style={{
                top: `${100 + index * 40}px`,
                zIndex: index + 1,
              }}
            >
              <div className="w-full md:w-1/3">
                <div className="mb-6">{skill.icon}</div>
                <h4 className="text-3xl md:text-4xl font-bold mb-4">{skill.title}</h4>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="w-full md:w-2/3 flex flex-wrap gap-3 mt-4 md:mt-0 justify-start md:justify-end">
                {skill.tags.map(tag => (
                  <span key={tag} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-full">
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