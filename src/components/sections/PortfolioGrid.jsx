import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Reveal from '../ui/Reveal';

const projects = [
  {
    title: "StudentPortal_Dashboard",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    tags: ["React", "Django REST Framework", "REST APIs"]
  },
  {
    title: "Sprint.X",
    category: "E_Commerce",
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
  return (
    <Reveal delay={index * 0.1} yOffset={50}>
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="group relative bg-[#F4F4F4] dark:bg-[#111] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl"
      >
        <div className="relative aspect-[5/6] overflow-hidden rounded-t-[2rem]">
          <motion.img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
          />
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <div className="bg-white text-black px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg">
               View Project
             </div>
          </div>
        </div>

        <div className="p-6 md:p-7">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">{project.category}</span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">{project.title}</h3>
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
          
          <div className="flex flex-wrap gap-2 mt-3">
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
    <section id="portfolio" className="py-24 md:py-28 px-6 bg-background transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-gray-400 mb-6">Selected Works</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-foreground">
                STUFF I'VE <span className="text-primary italic">CRAFTED</span>
              </h3>
            </Reveal>
          </div>
          
          <Reveal delay={0.4}>
            <p className="text-gray-500 max-w-sm text-base md:text-lg font-medium">
              A collection of digital products focused on simplicity and performance.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
