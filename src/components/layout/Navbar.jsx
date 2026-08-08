import { useState, useEffect, useRef } from 'react';
import { Home, Zap, User, Briefcase, MessageSquare } from 'lucide-react';

const navItems = [
  { icon: <Home size={20} />, label: 'Home', href: '#home' },
  { icon: <Zap size={20} />, label: 'Skills', href: '#skills' },
  { icon: <Briefcase size={20} />, label: 'Portfolio', href: '#portfolio' },
  { icon: <User size={20} />, label: 'About', href: '#about' },
  { icon: <MessageSquare size={20} />, label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const progressRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollY / docHeight : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }

        setIsScrolled(scrollY >= 50);

        const sectionIds = navItems.map((item) => item.href.slice(1));
        const offset = scrollY + window.innerHeight * 0.4;
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= offset) current = id;
        }
        if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
          current = sectionIds[sectionIds.length - 1];
        }
        setActiveSection(current);

        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full overflow-hidden relative backdrop-blur-2xl backdrop-saturate-[140%] bg-black/70 border border-white/10 transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isMounted ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'
        } ${
          isScrolled
            ? 'shadow-[0_10px_40px_-10px_rgba(230,126,34,0.35)] border-primary/20'
            : 'shadow-none'
        }`}
      >
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />

        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <a
              key={item.label}
              href={item.href}
              className={`group relative flex items-center justify-center p-3 rounded-full transition-all duration-300 ${
                isActive ? 'bg-primary/15' : 'hover:bg-white/10'
              }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 text-primary text-[10px] font-mono tracking-[0.18em] uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-primary-hair">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
