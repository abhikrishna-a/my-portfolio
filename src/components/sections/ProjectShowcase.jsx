import React, { useEffect } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';

const ProjectShowcase = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(230,126,34,0.14),_transparent_38%),linear-gradient(180deg,_rgba(249,249,249,0.92)_0%,_rgba(244,244,244,0.96)_100%)] backdrop-blur-3xl animate-fadeIn dark:bg-[radial-gradient(circle_at_top,_rgba(230,126,34,0.12),_transparent_38%),linear-gradient(180deg,_rgba(10,10,10,0.94)_0%,_rgba(17,17,17,0.98)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-20" />
      <div className="relative flex flex-col items-center">
        <div className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/65 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">
                Project View
              </span>
              <h2 className="text-xl font-black tracking-tight md:text-2xl">{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] transition-colors hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white dark:hover:text-black md:px-6 md:py-3"
            >
              <X size={20} />
              <span className="hidden md:inline">Close</span>
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:py-16">
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111]/85">
            <div className="grid gap-10 p-7 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.72fr)] md:p-10">
              <div className="max-w-3xl">
                <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
                  {project.category}
                </span>
                <h1 className="mb-5 text-5xl font-black leading-none tracking-tighter md:text-7xl">
                  {project.title}
                </h1>
                <p className="text-base font-medium leading-relaxed text-foreground/80 md:text-xl">
                  {project.description || 'A comprehensive digital solution tailored for modern needs, focusing on usability, performance, and clean design.'}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-widest dark:border-white/10 dark:bg-white/[0.04]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 rounded-[1.6rem] border border-black/5 bg-[linear-gradient(180deg,rgba(230,126,34,0.10),rgba(230,126,34,0.02))] p-5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(230,126,34,0.10),rgba(255,255,255,0.02))]">
                <div>
                  <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.32em] text-gray-500">
                    Project Access
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-foreground/70">
                    Explore the live product, source code, and final screens in a layout that matches the rest of the portfolio.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-lg transition-colors hover:bg-black"
                    >
                      Visit Site <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] transition-colors hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white dark:hover:text-black"
                    >
                      Source Code <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-8">
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">
                Interface Preview
              </span>
              <h3 className="text-2xl font-black tracking-tight md:text-3xl">Project Screens & Flow</h3>
            </div>

            <div className="grid gap-6">
              {project.screenshots && project.screenshots.length > 0 ? (
                project.screenshots.map((screenshot, idx) => (
                  <div
                    key={idx}
                    className={`overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 shadow-[0_24px_80px_-44px_rgba(0,0,0,0.32)] backdrop-blur-sm dark:border-white/10 dark:bg-[#111]/85 ${project.screenshotFrameClass || ''}`}
                  >
                    <div className="mb-3 flex items-center justify-between px-2 pt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500 md:px-3">
                      <span>{project.title}</span>
                      <span>Screen {idx + 1}</span>
                    </div>
                    <img
                      src={screenshot}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className={project.screenshotClass || 'w-full h-auto object-cover'}
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-video overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 shadow-[0_24px_80px_-44px_rgba(0,0,0,0.32)] dark:border-white/10 dark:bg-[#111]/85">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
