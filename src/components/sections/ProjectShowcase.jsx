import { useEffect, useRef } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const ProjectShowcase = ({ project, onClose }) => {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const restoreFocusRef = useRef(null);

  useEffect(() => {
    if (!project) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }

    // Locking overflow removes the scrollbar, which shifts the whole page
    // sideways by its width. Pad by the same amount so opening the overlay
    // does not move anything.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    restoreFocusRef.current = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Keep Tab inside the overlay. Without this, tabbing walks straight out
      // of the dialog and into the page behind it, which is still visible and
      // still focusable.
      const items = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      // Send focus back where it came from, so keyboard users are not dumped
      // at the top of the document.
      restoreFocusRef.current?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      className="fixed inset-0 z-[99999] overflow-y-auto overflow-x-hidden bg-background"
    >
      <div className="log-paper pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      <div className="relative flex flex-col items-center">
        <div className="sticky top-0 z-50 w-full border-b border-foreground/12 bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                Project View — Case Study
              </span>
              <h2 className="font-display text-xl font-black tracking-tight md:text-2xl text-foreground uppercase">{project.title}</h2>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label={`Close ${project.title}`}
              className="flex items-center gap-2 rounded-md border-[1.5px] border-foreground/30 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary hover:text-background hover:border-primary md:px-6 md:py-3 active:bg-primary focus-visible:bg-primary active:text-background focus-visible:text-background active:border-primary focus-visible:border-primary"
            >
              <X size={20} />
              <span className="hidden md:inline">Close</span>
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:py-16">
          <div className="overflow-hidden rounded-[0.9rem] border border-foreground/15 bg-card">
            <div className="grid gap-10 p-7 md:grid-cols-[minmax(0,1.5fr)_minmax(240px,0.72fr)] md:p-10">
              <div className="max-w-3xl">
                <span className="stamp mb-5">{project.category}</span>
                <h2 className="font-display mb-5 text-4xl font-black leading-none tracking-tighter uppercase md:text-6xl text-foreground">
                  {project.title}
                </h2>
                <p className="text-base font-medium leading-relaxed text-foreground/80 md:text-xl">
                  {project.description || 'A comprehensive digital solution tailored for modern needs, focusing on usability, performance, and clean design.'}
                </p>

                {project.subtitle && (
                  <>
                    <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary-dim">
                      {project.subtitle}
                    </p>
                    {project.tagline && (
                      <p className="mt-1 font-display text-lg font-bold tracking-tight text-foreground md:text-xl">
                        {project.tagline}
                      </p>
                    )}
                  </>
                )}

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-[4px] border border-primary/40 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 rounded-[0.9rem] border border-foreground/12 bg-secondary p-5">
                <div>
                  <span className="mb-4 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary-dim">
                    Case Sheet
                  </span>
                  <dl className="border-t-[3px] border-double border-foreground/20">
                    <div className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">File</dt>
                      <dd className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">{project.fileNo}</dd>
                    </div>
                    <div className="ledger-row flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Category</dt>
                      <dd className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">{project.category}</dd>
                    </div>
                    {project.role && (
                      <div className="ledger-row flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Role</dt>
                        <dd className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">{project.role}</dd>
                      </div>
                    )}
                    <div className="ledger-row flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Stack</dt>
                      <dd className="text-right font-mono text-xs font-bold uppercase tracking-wider text-foreground">{project.tags.join(' · ')}</dd>
                    </div>
                    {project.duration && (
                      <div className="ledger-row flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Duration</dt>
                        <dd className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">{project.duration}</dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-4 pt-2.5 pb-1">
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Status</dt>
                      <dd className={`font-mono text-xs font-bold uppercase tracking-wider ${project.status === 'SHIPPED' ? 'text-amber' : 'text-primary'}`}>{project.status}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary-dim active:bg-primary-dim focus-visible:bg-primary-dim"
                    >
                      Visit Site <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-md border-[1.5px] border-foreground/30 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary hover:text-background hover:border-primary active:bg-primary focus-visible:bg-primary active:text-background focus-visible:text-background active:border-primary focus-visible:border-primary"
                    >
                      Source Code <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className="rounded-[0.9rem] border border-foreground/15 bg-card p-7 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="stamp">Measurements</span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-muted">Meters · Field Data</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="measure-cell">
                    <div className="font-mono text-3xl md:text-4xl font-bold text-primary">{metric.value}</div>
                    <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.sections && project.sections.length > 0 && (
            <div className="rounded-[0.9rem] border border-foreground/15 bg-card p-7 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="stamp">Dossier</span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-muted">
                  {project.sections.length} Entries · Filed Notes
                </span>
              </div>
              <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                {project.sections.map((section, idx) => (
                  <div key={section.title} className="measure-cell">
                    <div className="mb-3 flex items-baseline gap-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-dim">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-lg font-black tracking-tight uppercase text-foreground md:text-xl">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-base font-medium leading-relaxed text-foreground/80">{section.body}</p>
                    {section.bullets && (
                      <ul className="mt-4 space-y-2 border-t border-foreground/12 pt-4">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-sm font-medium leading-relaxed text-foreground/75">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber/70" aria-hidden="true" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.subtitle && project.link && (
            <div className="rounded-[0.9rem] border border-foreground/15 bg-card p-7 md:p-8">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <span className="stamp mb-4">End of Entry</span>
                  <p className="font-display text-xl font-black tracking-tight uppercase text-foreground md:text-2xl">
                    {project.tagline || project.title}
                  </p>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-card active:bg-primary-dim focus-visible:bg-primary-dim"
                >
                  Live Site <ExternalLink size={18} />
                </a>
              </div>
            </div>
          )}

          {project.screenshots && project.screenshots.length > 0 && (
            <div className="flex flex-col gap-5 md:gap-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                    Plate — Print Series
                  </span>
                  <h3 className="ledger-head font-display text-2xl font-black tracking-tight uppercase md:text-3xl text-foreground">Project Screens & Flow</h3>
                </div>
                <span className="stamp-red font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-amber">
                  {project.screenshots.length} {project.screenshots.length === 1 ? 'Plate' : 'Plates'}
                </span>
              </div>

              <div className={`relative overflow-hidden rounded-[0.9rem] border border-foreground/15 bg-card ${project.screenshotFrameClass || ''}`}>
                <div className="absolute -top-2 left-12 w-24 h-6 tape -rotate-2 opacity-90" aria-hidden="true" />
                <div className="flex items-center justify-between gap-4 px-4 pt-4 md:px-5">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
                  </span>
                  <span className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary-dim">
                    <span>{project.title}</span>
                    <span className="text-muted">Flow</span>
                  </span>
                  <span className="hidden md:block font-mono text-[9px] tracking-[0.2em] text-muted">plate.tsx</span>
                </div>
                <div className="no-scrollbar max-h-[72vh] overflow-y-auto overscroll-contain">
                  {project.screenshots.map((screenshot, idx) => (
                    <div key={idx} className="border-t border-foreground/12">
                      {/* loading/decoding only. No width/height here on purpose: the six
                          screenshots have four different intrinsic ratios
                          (1920x915, x897, x931, x930) and `h-auto` derives the
                          box from whatever is declared, so one hardcoded pair
                          would distort the ones that differ. */}
                      <img
                        src={screenshot}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className={`block w-full h-auto object-cover ${project.screenshotClass || ''}`}
                      />
                      <div className="flex items-center justify-between gap-4 bg-secondary/70 px-4 py-2.5 md:px-5">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-primary-dim">
                          Fig. 0{idx + 1}
                        </span>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
                          {project.title} — Plate 0{idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {project.coverImage && (
            <div className="overflow-hidden rounded-[0.9rem] border border-foreground/15 bg-card shadow-[0_10px_30px_-18px_rgba(27,35,51,0.45)]">
              <img
                src={project.coverImage}
                alt={project.coverAlt}
                loading="lazy"
                decoding="async"
                width={project.coverWidth}
                height={project.coverHeight}
                className="block w-full h-auto object-cover object-top"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
