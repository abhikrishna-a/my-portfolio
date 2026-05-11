import React, { useEffect } from 'react';
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Marquee from './components/ui/Marquee'
import SkillsStack from './components/sections/SkillsStack'
import PortfolioGrid from './components/sections/PortfolioGrid'
import Footer from './components/layout/Footer'
import useSmoothScroll from './hooks/useSmoothScroll'
import Reveal from './components/ui/Reveal'
import CustomCursor from './components/layout/CustomCursor'
import Preloader from './components/layout/Preloader'
import AnimatedCounter from './components/ui/AnimatedCounter'

function App() {
  useEffect(() => {
    // Prevent browser from restoring previous scroll position on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useSmoothScroll();
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white transition-colors duration-500">
      <Preloader />
      <CustomCursor />
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(230,126,34,0.05),_transparent_50%)] pointer-events-none"></div>
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Marquee Stats */}
      <Marquee />

      {/* Skills Stacking Section */}
      <div className="bg-background transition-colors duration-500">
        <SkillsStack />
      </div>

      {/* Portfolio Grid Section */}
      <PortfolioGrid />

      {/* About Section / Space for more content */}
      <section id="about" className="py-32 px-6 bg-background flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <Reveal delay={0.2}>
            <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-gray-400 mb-8">About Me</h2>
          </Reveal>
          
          <Reveal delay={0.4}>
            <p className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              I'm a designer and developer who cares deeply about <span className="text-primary italic">crafting digital products</span> that solve problems and look beautiful.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Reveal delay={0.6} yOffset={30}>
              <div className="px-8 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-card shadow-sm flex flex-col items-center transition-colors">
                <AnimatedCounter to={20} suffix="+" className="text-3xl font-black text-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Projects</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.7} yOffset={30}>
              <div className="px-8 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-card shadow-sm flex flex-col items-center transition-colors">
                <AnimatedCounter to={100} suffix="+" className="text-3xl font-black text-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Problems Solved</span>
              </div>
            </Reveal>

            <Reveal delay={0.8} yOffset={30}>
              <div className="px-8 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-card shadow-sm flex flex-col items-center transition-colors">
                <AnimatedCounter to={10} suffix="+" className="text-3xl font-black text-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Hours Coding</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <Footer />
    </main>
  )
}

export default App
