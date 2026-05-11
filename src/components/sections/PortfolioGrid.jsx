import React, { useState } from 'react';
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
    screenshots: [
      "/edusphere-1.png",
      "/edusphere-2.png"
    ]
  },
  {
    title: "Sprint.X",
    category: "E-Commerce",
    image: "/Sprint.X.png",
    tags: ["React", "JavaScript", "Django"],
    description: "A clean e-commerce app built with full frontend and backend functionality, focused on smooth shopping, clear product discovery, and a simple user-friendly experience.",
    github: "https://github.com/abhikrishna-a/Ecommerce_online",
    screenshots: [
      "/SprintX1.png",
      "/SprintX2.png"
    ]
  },
  // {
  //   title: "Aether Brand Identity",
  //   category: "Branding",
  //   image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=60",
  //   tags: ["Typography", "Logo", "Styleguide"]
  // },
  // {
  //   title: "Lumina E-Commerce",
  //   category: "E-Commerce",
  //   image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60",
  //   tags: ["Next.js", "Stripe", "Tailwind"]
  // }
];

const ProjectCard = ({ project, index, onClick }) => {
  return (
    <Reveal delay={index * 0.1} yOffset={50}>
      <button
        type="button"
        onClick={() => onClick(project)}
        className="group relative w-full overflow-hidden rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,244,244,0.96))] text-left transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_30px_80px_-40px_rgba(230,126,34,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-4 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,22,22,0.96),rgba(12,12,12,0.98))] dark:hover:border-primary/20 dark:hover:shadow-[0_30px_80px_-40px_rgba(230,126,34,0.22)]"
        aria-label={`Open ${project.title} project`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,126,34,0.16),transparent_34%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(230,126,34,0.10),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-center justify-between border-b border-black/5 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.34em] text-gray-500 dark:border-white/10">
          <span>{project.category}</span>
          <span className="transition-colors duration-300 group-hover:text-primary">Selected Project</span>
        </div>

        <div className="relative aspect-[5/6] overflow-hidden p-5 md:p-6">
          <div className="absolute inset-x-5 bottom-0 top-5 rounded-[1.6rem] border border-black/5 bg-[linear-gradient(180deg,rgba(249,249,249,0.92),rgba(241,241,241,0.96))] transition-all duration-500 group-hover:border-primary/15 group-hover:bg-[linear-gradient(180deg,rgba(255,250,245,0.96),rgba(255,244,232,0.98))] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(14,14,14,0.98))] dark:group-hover:border-primary/15 dark:group-hover:bg-[linear-gradient(180deg,rgba(40,24,12,0.96),rgba(18,18,18,0.98))]" />
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.45rem] border border-black/5 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-primary/20 group-hover:shadow-[0_24px_60px_-32px_rgba(230,126,34,0.32)] dark:border-white/10 dark:bg-[#181818]">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-contain p-4 md:p-5 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        </div>

        <div className="relative p-6 md:p-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-[2rem] font-black tracking-tight leading-none">{project.title}</h3>
              {project.description && (
                <p className="mt-4 line-clamp-3 max-w-xl text-sm font-medium leading-relaxed text-foreground/78 md:text-[15px]">
                  {project.description}
                </p>
              )}
            </div>
            <span className="mt-1 inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-background text-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/20 group-hover:bg-primary group-hover:text-white dark:border-white/10">
              <ArrowUpRight size={18} />
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {project.tags.map(tag => (
              <span key={tag} className="rounded-full border border-black/5 bg-black/[0.03] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/[0.08] dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:group-hover:border-primary/20 dark:group-hover:bg-primary/[0.14]">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4 text-xs font-bold uppercase tracking-[0.24em] text-gray-500 transition-colors duration-300 group-hover:border-primary/15 dark:border-white/10 dark:group-hover:border-primary/15">
            <span className="transition-colors duration-300 group-hover:text-primary">Open Project</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">Case Study</span>
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
      <section id="portfolio" className="py-24 md:py-28 px-6 bg-[radial-gradient(circle_at_top,_rgba(230,126,34,0.08),_transparent_24%),linear-gradient(180deg,_rgba(249,249,249,1)_0%,_rgba(249,249,249,1)_100%)] transition-colors duration-500 dark:bg-[radial-gradient(circle_at_top,_rgba(230,126,34,0.08),_transparent_24%),linear-gradient(180deg,_rgba(10,10,10,1)_0%,_rgba(10,10,10,1)_100%)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:items-end">
            <div className="max-w-3xl">
              <Reveal>
                <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-gray-400 mb-6">Selected Works</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-foreground">
                  PROJECTS THAT TURN <span className="text-primary italic">IDEAS</span> INTO EXPERIENCES
                </h3>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <div className="rounded-[1.5rem] border border-black/5 bg-white/70 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]">
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
