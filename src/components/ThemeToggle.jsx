import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import Magnetic from './Magnetic';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed top-8 right-8 z-[100]">
      <Magnetic>
        <button 
          onClick={toggleTheme}
          data-cursor="hover"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-lg text-foreground hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </Magnetic>
    </div>
  );
};

export default ThemeToggle;
