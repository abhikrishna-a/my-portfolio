import { useEffect } from 'react';
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import RunningBadge from './components/ui/RunningBadge'
import Marquee from './components/ui/Marquee'
import SkillsStack from './components/sections/SkillsStack'
import PortfolioGrid from './components/sections/PortfolioGrid'
import AboutSection from './components/sections/AboutSection'
import Footer from './components/layout/Footer'
import useSmoothScroll from './hooks/useSmoothScroll'
import CustomCursor from './components/layout/CustomCursor'
import Preloader from './components/layout/Preloader'
import Starfield from './components/effects/Starfield'

function App() {
  useEffect(() => {
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
      <Navbar />
      <Hero />
      <Starfield />
      <RunningBadge />
      <Marquee />
      <div className="transition-colors duration-500">
        <SkillsStack />
      </div>
      <PortfolioGrid />
      <AboutSection />
      <Footer />
    </main>
  )
}

export default App
