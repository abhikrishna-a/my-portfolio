import { useState, useRef, useEffect } from 'react';
import { Copy, Linkedin, Github, Mail, Check } from 'lucide-react';
import Reveal from '../ui/Reveal';
import Magnetic from '../ui/Magnetic';

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const email = "abhikrishna616@gmail.com";
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      // pt/pb replace the old py-20. The extra bottom padding reserves room for
      // the fixed dock, which sits over the end of the page: measured at maximum
      // scroll it was covering the last block of text at every width from 320 to
      // 1440. The dock is ~72px tall plus a 24px / md:32px offset, so this is set
      // above that rather than exactly to it.
      className="relative text-foreground px-6 pt-20 pb-36 md:pb-40"
    >
      {/* Corner marks */}
      <div className="absolute top-6 left-6 w-7 h-7 border border-foreground/30 border-r-0 border-b-0" aria-hidden="true" />
      <div className="absolute top-6 right-6 w-7 h-7 border border-foreground/30 border-l-0 border-b-0" aria-hidden="true" />
      <div className="absolute bottom-6 left-6 w-7 h-7 border border-foreground/30 border-r-0 border-t-0" aria-hidden="true" />
      <div className="absolute bottom-6 right-6 w-7 h-7 border border-foreground/30 border-l-0 border-t-0" aria-hidden="true" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Reveal width="100%" origin="bottom" distance={24} scale={0.98}>
          <div className="text-center mb-16">
            <span className="stamp mb-10">Let's Connect</span>
            <h2 className="ledger-head font-display text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
              Ready to bring your
              <br />
              ideas to life?
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2} origin="bottom" distance={24} scale={0.98}>
          <Magnetic>
            <div onClick={copyToClipboard} className="relative group cursor-pointer" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyToClipboard(); } }} aria-label="Copy email to clipboard">
              <div className="px-8 py-6 rounded-lg border-[1.5px] border-foreground/30 bg-card transition-all duration-300 group-hover:border-primary flex items-center gap-4 card-shine group-active:border-primary group-focus-within:border-primary">
                <span className="font-mono text-lg md:text-2xl font-bold tracking-tight">
                  {email}
                </span>
                <div className="p-2.5 bg-primary rounded-md text-background">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </div>
              </div>
              {copied && (
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary font-mono font-bold uppercase text-xs tracking-widest animate-revealUp">
                  Copied to clipboard!
                </span>
              )}
            </div>
          </Magnetic>
        </Reveal>

        <div className="mt-28 w-full flex flex-col md:flex-row justify-between items-center gap-10 border-t border-foreground/12 pt-12">
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/in/abhikrishna22" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex h-11 w-11 items-center justify-center rounded-md border-[1.5px] border-foreground/25 text-foreground hover:text-background hover:bg-primary hover:border-primary transition-all duration-300 active:text-background focus-visible:text-background active:bg-primary focus-visible:bg-primary active:border-primary focus-visible:border-primary">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/abhikrishna-a" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="inline-flex h-11 w-11 items-center justify-center rounded-md border-[1.5px] border-foreground/25 text-foreground hover:text-background hover:bg-primary hover:border-primary transition-all duration-300 active:text-background focus-visible:text-background active:bg-primary focus-visible:bg-primary active:border-primary focus-visible:border-primary">
              <Github size={18} />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abhikrishna616@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className="inline-flex h-11 w-11 items-center justify-center rounded-md border-[1.5px] border-foreground/25 text-foreground hover:text-background hover:bg-primary hover:border-primary transition-all duration-300 active:text-background focus-visible:text-background active:bg-primary focus-visible:bg-primary active:border-primary focus-visible:border-primary">
              <Mail size={18} />
            </a>
          </div>

          <div className="font-mono text-foreground/70 font-bold uppercase text-xs tracking-widest flex items-center gap-4">
            <span>©Portfolio</span>
            <span className="w-1 h-1 bg-amber/70 rounded-full" />
            <span className="text-primary-dim">Abhikrishna.</span>
            <span className="w-1 h-1 bg-amber/70 rounded-full" />
            <span className="stamp-red">Signed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
