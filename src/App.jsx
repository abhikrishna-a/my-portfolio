import { useEffect } from 'react';
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import RunningBadge from './components/ui/RunningBadge'
import Marquee from './components/ui/Marquee'
import SkillsStack from './components/sections/SkillsStack'
import PortfolioGrid from './components/sections/PortfolioGrid'
import AboutSection from './components/sections/AboutSection'
import ResumeSection from './components/sections/ResumeSection'
import Footer from './components/layout/Footer'
import useSmoothScroll from './hooks/useSmoothScroll'
import CustomCursor from './components/layout/CustomCursor'
import Preloader from './components/layout/Preloader'
import LogbookPaper from './components/effects/LogbookPaper'

function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useSmoothScroll();
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Direction contract lives as an HTML comment in index.html (seed key 3fc37d6d). */}
      <Preloader />
      <CustomCursor />
      <LogbookPaper />
      <Navbar />
      <Hero />
      <RunningBadge />
      <Marquee />
      <SkillsStack />
      <PortfolioGrid />
      <AboutSection />
      <ResumeSection />
      <Footer />
    </main>
  )
}

export default App
