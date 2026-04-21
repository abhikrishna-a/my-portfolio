import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Copy, Linkedin, Github, Mail, Check } from 'lucide-react';

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const email = "abhikrishna616@gmail.com";

  // Magnetic Button Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="bg-black text-white py-20 px-6 rounded-t-[5rem] mt-[-5rem] relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-primary mb-6">Let's Connect</h2>
          <h3 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Ready to bring your <br /> ideas to life?
          </h3>
        </motion.div>

        {/* Magnetic Email Button */}
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={copyToClipboard}
          className="relative group cursor-pointer"
        >
          <div className="px-12 py-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300 flex items-center gap-4">
            <span className="text-2xl md:text-4xl font-bold tracking-tight">
              {email}
            </span>
            <div className="p-3 bg-white rounded-full text-black">
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </div>
          </div>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary font-bold uppercase text-xs tracking-widest"
            >
              Copied to clipboard!
            </motion.span>
          )}
        </motion.div>

        {/* Social Links */}
        <div className="mt-32 w-full flex flex-col md:flex-row justify-between items-center gap-10 border-t border-white/10 pt-16">
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/in/abhikrishna22" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300 transform hover:scale-110"><Linkedin size={24} /></a>
            <a href="https://github.com/abhikrishna-a" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300 transform hover:scale-110"><Github size={24} /></a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abhikrishna616@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300 transform hover:scale-110"><Mail size={24} /></a>
          </div>

          <div className="text-gray-500 font-bold uppercase text-xs tracking-widest flex items-center gap-4">
            <span>©Portfolio</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
            <span>Abhikrishna.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
