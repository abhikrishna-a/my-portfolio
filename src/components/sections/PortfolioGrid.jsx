import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ProjectShowcase from './ProjectShowcase';

const projects = [
  {
    title: "EduSphere",
    category: "Web Application",
    image: "/edusphere.png",
    tags: ["React", "Django REST Framework", "REST APIs"],
    description: "A clean, modern platform designed to help students confidently manage courses, track progress, and crush academic goals without the clutter.",
    link: "https://student-management-eight-rho.vercel.app/",
    github: "https://github.com/abhikrishna-a/student-management",
    screenshots: ["/edusphere-1.png", "/edusphere-2.png"]
  },
  {
    title: "Sprint.X",
    category: "E-Commerce",
    image: "/Sprint.X.png",
    tags: ["React", "JavaScript", "Django"],
    description: "A clean e-commerce app built with full frontend and backend functionality, focused on smooth shopping, clear product discovery, and a simple user-friendly experience.",
    github: "https://github.com/abhikrishna-a/Ecommerce_online",
    screenshots: ["/SprintX1.png", "/SprintX2.png"]
  },
];

const ProjectCard = ({ project, index, onClick }) => {
  return (
    <Reveal delay={index * 0.1} origin="bottom" distance={30} scale={0.9} duration={0.8}>
      <button
        type="button"
        onClick={() => onClick(project)}
        className="group relative w-full overflow-hidden rounded-[2rem] text-left transition-all duration-700 hover:-translate-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-4 backdrop-blur-2xl bg-black/70 border border-white/10"
        aria-label={`Open ${project.title} project`}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(circle at top right, rgba(230,126,34,0.15), transparent 34%)',
            boxShadow: '0 40px 100px -20px rgba(230,126,34,0.20)',
          }}
        />

        <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-gray-500">
            {project.category}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-gray-500 transition-colors duration-300 group-hover:text-primary">
            Selected Project
          </span>
        </div>

        <div className="relative aspect-[5/6] overflow-hidden p-5 md:p-6">
          <div className="absolute inset-x-5 bottom-0 top-5 rounded-[1.6rem] border border-white/10 bg-black/80 transition-all duration-700 group-hover:border-primary/25" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.45rem] border border-white/10 bg-black shadow-[0_18px_40px_-30px_rgba(0,0,0,0.50)] transition-all duration-700 group-hover:-translate-y-1.5 group-hover:border-primary/30 group-hover:shadow-[0_0_12px_rgba(230,126,34,0.30)]">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-contain p-4 md:p-5 transition-transform duration-700 group-hover:scale-[1.06]"
            />
          </div>
        </div>

        <div className="relative p-6 md:p-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-mono text-2xl md:text-[2rem] font-black tracking-tight leading-none">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-4 line-clamp-3 max-w-xl text-sm font-medium leading-relaxed text-foreground/78 md:text-[15px]">
                  {project.description}
                </p>
              )}
            </div>
            <span className="mt-1 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black text-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/20 group-hover:bg-primary group-hover:text-black">
              <ArrowUpRight size={18} />
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-primary-hair px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-all duration-500 group-hover:border-primary/50 group-hover:bg-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono font-bold uppercase tracking-[0.24em] text-gray-500 transition-all duration-500 group-hover:border-primary/20">
            <span className="inline-flex items-center gap-2 transition-all duration-500 group-hover:text-primary group-hover:translate-x-1">
              Open Project
              <span className="block h-px w-0 bg-primary transition-all duration-500 group-hover:w-8" />
            </span>
            <span className="inline-flex items-center gap-2 transition-all duration-500 group-hover:translate-x-2 group-hover:text-primary/80">
              Case Study
              <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </button>
    </Reveal>
  );
};

const PortfolioGrid = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <section id="portfolio" className="py-24 md:py-28 px-6 bg-background transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-end">
            <div className="max-w-3xl">
              <Reveal origin="left" distance={30} scale={0.9}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px w-8 bg-primary/60" />
                  <span className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase text-primary-dim">
                    Selected Works
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.2} origin="left" distance={30} scale={0.9}>
                <h3 className="font-mono text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-foreground">
                  PROJECTS THAT TURN <span className="text-primary italic">IDEAS</span> INTO EXPERIENCES
                </h3>
              </Reveal>
            </div>

            <Reveal delay={0.4} origin="right" distance={30} scale={0.9}>
              <div className="rounded-[1.5rem] p-5 backdrop-blur-2xl backdrop-saturate-[140%] bg-black/55 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
                <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
                  A focused collection of products shaped around clarity, performance, and interfaces people can use without friction.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} onClick={setSelectedProject} />
            ))}
          </div>
        </div>
      </section>
      <ProjectShowcase project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default PortfolioGrid;
