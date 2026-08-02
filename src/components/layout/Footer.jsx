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
      className="bg-black text-white py-20 px-6 rounded-t-[5rem] mt-[-5rem] relative z-30"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[22px] left-[22px] w-[34px] h-[34px] border border-primary-hair border-r-0 border-b-0 animate-cornerFlick" />
        <div className="absolute top-[22px] right-[22px] w-[34px] h-[34px] border border-primary-hair border-l-0 border-b-0 animate-cornerFlick" />
        <div className="absolute bottom-[22px] left-[22px] w-[34px] h-[34px] border border-primary-hair border-r-0 border-t-0 animate-cornerFlick" />
        <div className="absolute bottom-[22px] right-[22px] w-[34px] h-[34px] border border-primary-hair border-l-0 border-t-0 animate-cornerFlick" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Reveal width="100%" origin="bottom" distance={30} scale={0.9}>
          <div className="text-center mb-16">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-6 block">
              Let's Connect
            </span>
            <h3 className="font-mono text-5xl md:text-8xl font-black tracking-tighter leading-none">
              Ready to bring your <br /> ideas to life?
            </h3>
          </div>
        </Reveal>

        <Magnetic>
          <div onClick={copyToClipboard} className="relative group cursor-pointer">
            <div className="px-12 py-10 rounded-full backdrop-blur-sm border border-white/20 bg-white/5 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 flex items-center gap-4">
              <span className="font-mono text-2xl md:text-4xl font-bold tracking-tight">
                {email}
              </span>
              <div className="p-3 bg-primary rounded-full text-black">
                {copied ? <Check size={24} /> : <Copy size={24} />}
              </div>
            </div>
            {copied && (
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary font-mono font-bold uppercase text-xs tracking-widest animate-revealUp">
                Copied to clipboard!
              </span>
            )}
          </div>
        </Magnetic>

        <div className="mt-32 w-full flex flex-col md:flex-row justify-between items-center gap-10 border-t border-white/10 pt-16">
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/abhikrishna22" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors duration-300 transform hover:scale-110">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/abhikrishna-a" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors duration-300 transform hover:scale-110">
              <Github size={24} />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abhikrishna616@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors duration-300 transform hover:scale-110">
              <Mail size={24} />
            </a>
          </div>

          <div className="font-mono text-gray-500 font-bold uppercase text-xs tracking-widest flex items-center gap-4">
            <span>©Portfolio</span>
            <span className="w-1 h-1 bg-primary-hair rounded-full" />
            <span>Abhikrishna.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
