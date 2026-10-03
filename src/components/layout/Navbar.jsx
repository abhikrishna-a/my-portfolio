import { useState, useEffect, useRef } from 'react';
import { Home, Zap, Briefcase, User, MessageSquare } from 'lucide-react';

const navItems = [
  { icon: <Home size={18} />, label: 'Home', href: '#home', index: '01' },
  { icon: <Zap size={18} />, label: 'Skills', href: '#skills', index: '02' },
  { icon: <Briefcase size={18} />, label: 'Portfolio', href: '#portfolio', index: '03' },
  { icon: <User size={18} />, label: 'About', href: '#about', index: '04' },
  { icon: <MessageSquare size={18} />, label: 'Contact', href: '#contact', index: '05' },
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
    <nav className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100]">
      <div
        className={`flex items-center gap-1 px-2 py-2 rounded-lg border border-foreground/20 bg-card/90 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMounted ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'
        } ${
          isScrolled
            ? 'shadow-[0_10px_30px_-18px_rgba(27,35,51,0.45)] border-primary/30'
            : 'shadow-none'
        }`}
      >
        <div
          ref={progressRef}
          className="absolute top-0 left-0 right-0 h-[2px] bg-primary origin-left"
          style={{ transform: 'scaleX(0)' }}
        />

        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={isActive ? 'location' : undefined}
              className={`group relative flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 ${
                isActive ? 'bg-primary text-background' : 'text-foreground/70 hover:text-primary'
              }`}
            >
              {/* The name comes from a single always-present sr-only label.
                  Previously the anchor carried aria-label="Home" while also
                  rendering the visible text "01" and a duplicate tooltip, none
                  of which were in the accessible name -- WCAG "Label in Name"
                  failure. The index and the tooltip are decorative repeats,
                  so they are hidden from assistive tech. The sr-only label also
                  means the link has a name at every width, which it did not
                  before below lg where the visible label is display:none. */}
              <span aria-hidden="true" className="hidden md:inline font-mono text-[9px] font-bold tracking-widest opacity-75">
                {item.index}
              </span>
              <span aria-hidden="true" className={`transition-colors duration-300 ${isActive ? 'text-background' : ''}`}>
                {item.icon}
              </span>
              <span aria-hidden="true" className="hidden lg:inline font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
                {item.label}
              </span>
              <span className="sr-only">{item.label}</span>
              <span aria-hidden="true" className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-[10px] font-mono tracking-[0.18em] uppercase rounded-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
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
