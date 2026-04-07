import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Reveal from './Reveal';

const projects = [
  {
    title: "EcoSphere Dashboard",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    tags: ["React", "D3.js", "Node.js"]
  },
  {
    title: "Nova Mobile App",
    category: "Mobile UI/UX",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop&q=60",
    tags: ["React Native", "Firebase", "Figma"]
  },
  {
    title: "Aether Brand Identity",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=60",
    tags: ["Typography", "Logo", "Styleguide"]
  },
  {
    title: "Lumina E-Commerce",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60",
    tags: ["Next.js", "Stripe", "Tailwind"]
  }
];

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  
  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20 });

  // Scroll Parallax setup
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  function handleMouseMove(event) {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos - width / 2);
    y.set(mouseYPos - height / 2);
    
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Reveal delay={index * 0.1} yOffset={50}>
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative bg-[#F4F4F4] dark:bg-[#111] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl perspective-1000"
      >
        {/* Project Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[2.5rem]">
          <motion.img 
            style={{ y: yParallax, scale: 1.25 }}
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.3] transition-all duration-700 ease-out"
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <div 
               className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transform translate-z-20 shadow-xl"
               style={{ transform: "translateZ(50px)" }}
             >
               View Project
             </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-8" style={{ transform: "translateZ(30px)" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">{project.category}</span>
              <h3 className="text-2xl font-black tracking-tight">{project.title}</h3>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-colors">
                <Github size={18} />
              </button>
              <button className="p-2 rounded-full bg-primary text-white hover:bg-black transition-colors">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-card border border-gray-200 dark:border-gray-800 rounded-full transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
};

const PortfolioGrid = () => {
  return (
    <section id="portfolio" className="py-32 px-6 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <Reveal>
              <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-gray-400 mb-6">Selected Works</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
                STUFF I'VE <span className="text-primary italic">CRAFTED</span>
              </h3>
            </Reveal>
          </div>
          
          <Reveal delay={0.4}>
            <p className="text-gray-500 max-w-sm text-lg md:text-xl font-medium">
              A collection of digital products focused on simplicity and performance.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
