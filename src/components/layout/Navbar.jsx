import { motion, useScroll, useSpring } from 'framer-motion';
import { Home, Zap, User, Briefcase, MessageSquare } from 'lucide-react';

const navItems = [
  { icon: <Home size={20} />, label: 'Home', href: '#home' },
  { icon: <Zap size={20} />, label: 'Skills', href: '#skills' },
  { icon: <Briefcase size={20} />, label: 'Portfolio', href: '#portfolio' },
  { icon: <User size={20} />, label: 'About', href: '#about' },
  { icon: <MessageSquare size={20} />, label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden relative transition-colors"
      >
        {/* Scroll Progress Indicator */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
          style={{ scaleX }}
        />

        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group relative flex items-center justify-center p-3 rounded-full hover:bg-black transition-all duration-300 transform"
          >
            <span className="text-gray-500 group-hover:text-white transition-colors duration-300">
              {item.icon}
            </span>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </a>
        ))}
      </motion.div>
    </nav>
  );
};

export default Navbar;
