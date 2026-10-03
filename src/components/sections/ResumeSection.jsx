import { Download } from 'lucide-react';
import Reveal from '../ui/Reveal';

const ResumeSection = () => {
  return (
    <section id="resume" className="relative border-t border-foreground/10 py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6">
        <Reveal origin="bottom" scale={0.98} distance={24}>
          <div className="relative max-w-3xl">
            <div className="absolute -top-4 left-8 h-6 w-24 -rotate-2 tape" aria-hidden="true" />
            <h2 className="ledger-head font-display text-4xl font-black uppercase tracking-tighter text-foreground md:text-6xl">
              Résumé
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15} origin="bottom" scale={0.98} distance={24} width="100%">
          <div className="card-shine relative overflow-hidden rounded-[0.9rem] border border-foreground/15 bg-card p-7 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <span className="stamp mb-4">Curriculum Vitae</span>
                <p className="font-display text-xl font-black uppercase tracking-tight text-foreground md:text-2xl">
                  Abhikrishna A — Python Full-Stack Developer
                </p>
                <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-foreground/80">
                  Experience, projects, and technical skills in one document. PDF, 54 KB.
                </p>
              </div>

              <a
                href="/abhikrishna-resume.pdf"
                download="Abhikrishna(Full Stack developer).pdf"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <Download size={18} />
                Download PDF
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ResumeSection;
