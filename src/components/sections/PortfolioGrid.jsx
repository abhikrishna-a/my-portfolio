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
    meta: "Course & progress tracking",
    link: "https://student-management-eight-rho.vercel.app/",
    github: "https://github.com/abhikrishna-a/student-management",
    screenshots: ["/edusphere-1.png", "/edusphere-2.png"],
    fileNo: "FILE 01",
    status: "SHIPPED",
    date: "2026",
    role: "Full-Stack Engineer",
    duration: "6 weeks",
    metrics: [
      { label: "Modules", value: "8" },
      { label: "API endpoints", value: "25+" },
      { label: "Pages", value: "6" },
    ],
    problem: "Students had to juggle courses, assignments, and progress across scattered tools, making it hard to see where they actually stood.",
    solution: "One clean portal — course enrollment, progress tracking, and goal-setting in a single interface backed by a real REST API and database.",
  },
  {
    title: "Sprint.X",
    category: "E-Commerce",
    image: "/Sprint.X.png",
    tags: ["React", "JavaScript", "Django"],
    description: "A clean e-commerce app built with full frontend and backend functionality, focused on smooth shopping, clear product discovery, and a simple user-friendly experience.",
    meta: "Products, cart & checkout",
    github: "https://github.com/abhikrishna-a/Ecommerce_online",
    screenshots: ["/SprintX1.png", "/SprintX2.png"],
    fileNo: "FILE 02",
    status: "BUILT",
    date: "2026",
    role: "Full-Stack Engineer",
    duration: "8 weeks",
    metrics: [
      { label: "Products", value: "40+" },
      { label: "Checkout steps", value: "3" },
      { label: "Pages", value: "7" },
    ],
    problem: "Shopping flows were cluttered, burying the path from product to checkout under noise.",
    solution: "Clear product discovery, a lightweight cart, and a three-step checkout keep the entire purchase path simple.",
  },
];

const ProjectCard = ({ project, index, onClick }) => {
  return (
    <Reveal delay={index * 0.1} origin="bottom" distance={24} scale={0.98} duration={0.8}>
      <button
        type="button"
        onClick={() => onClick(project)}
        className="group relative w-full overflow-hidden rounded-[0.9rem] bg-card text-left transition-all duration-700 motion-safe:hover:-translate-y-1 hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background border border-foreground/15 card-shine"
        aria-label={`Open ${project.title} project`}
      >
        <div className="relative flex items-center justify-between border-b border-foreground/12 px-6 py-4">
          <span className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-muted">
              Project File — {project.fileNo}
            </span>
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-primary-dim transition-colors duration-300 group-hover:text-primary">
            {project.category}
          </span>
        </div>

        <div className="relative aspect-[5/6] overflow-hidden p-5 md:p-6">
          <div className="absolute inset-x-5 top-4 bottom-4 rounded-lg border border-foreground/12 bg-background" />
          <div className="absolute top-3 left-10 w-20 h-5 tape -rotate-2 opacity-90" aria-hidden="true" />
          <div className="absolute bottom-3 right-8 w-16 h-5 tape rotate-2 opacity-90" aria-hidden="true" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md border border-foreground/12 bg-background transition-all duration-700 group-hover:border-primary/30">
            <span className="absolute inset-0 flex items-center justify-center font-display text-5xl md:text-7xl font-black uppercase text-primary/[0.05] select-none">
              {project.title.split(' ')[0]}
            </span>
            <span
              aria-hidden="true"
              className={`absolute top-3 right-3 z-10 -rotate-3 ${project.status === 'SHIPPED' ? 'stamp-red' : 'stamp'} opacity-95 select-none`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <div className="relative px-6 md:px-7 pb-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl md:text-[1.9rem] font-black tracking-tight leading-none text-foreground uppercase">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-4 line-clamp-3 max-w-xl text-sm font-medium leading-relaxed text-foreground/75 md:text-[15px]">
                  {project.description}
                </p>
              )}
            </div>
            <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-[1.5px] border-foreground/25 text-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary group-hover:bg-primary group-hover:text-background">
              <ArrowUpRight size={18} />
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            <span>{project.role}</span>
            <span className="h-1 w-1 rounded-full bg-amber/70" aria-hidden="true" />
            <span>{project.duration}</span>
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className="mt-5 grid grid-cols-2 border-t border-foreground/12">
              {project.metrics.slice(0, 2).map((metric, i) => (
                <div key={metric.label} className={`pt-3 ${i > 0 ? 'border-l border-foreground/12 pl-5' : 'pr-5'}`}>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">{metric.label}</div>
                  <div className="mt-1 font-mono text-2xl font-bold text-primary">{metric.value}</div>
                </div>
              ))}
            </div>
          )}

          {project.meta && (
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-dim">
              {project.meta}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="rounded-[4px] border border-primary/40 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-colors duration-500 group-hover:border-primary/70 group-hover:bg-primary/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-foreground/12 pt-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-500 group-hover:border-primary/25">
            <span className="inline-flex items-center gap-2 transition-all duration-500 group-hover:text-primary group-hover:translate-x-1">
              Open Project
              <span className="block h-px w-8 origin-left bg-primary scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <span className="inline-flex items-center gap-2 transition-all duration-500 group-hover:translate-x-1 group-hover:text-primary/80">
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
      <section id="portfolio" className="relative py-24 md:py-28 px-6 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-end">
            <div className="max-w-3xl">
              <Reveal origin="left" distance={24} scale={0.98}>
                <h2 className="ledger-head font-display text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                  Projects that turn <span className="text-primary">ideas</span> into experiences
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.2} origin="right" distance={24} scale={0.98}>
              <div className="relative rounded-[0.9rem] p-6 bg-card border border-foreground/15">
                <div className="absolute -top-3 right-6 w-20 h-5 tape rotate-2" aria-hidden="true" />
                <span className="stamp mb-4">Selected Builds</span>
                <p className="text-foreground/80 text-base md:text-lg font-medium leading-relaxed">
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
