import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Particles from './components/Particles';
import DarkVeil from './components/ui/DarkVeil';
import LoadingScreen from './components/ui/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import UIUX from './components/UIUX';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Certifications from './components/Certifications';
import ChatBot from './components/ChatBot';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) return saved;
    }
    return 'dark'; // default to premium dark mode
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // ── Section Tracking via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const SECTION_IDS = ['about', 'tech', 'certifications', 'projects', 'uiux', 'services', 'timeline', 'contact'];
    const observers = [];

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isLoading]); // re-run after loading screen so DOM exists

  const isDark = theme === 'dark';

  const particleColors = isDark
    ? ["#7c3aed", "#2563eb", "#a78bfa", "#60a5fa"]
    : ["#1e293b", "#3b82f6", "#475569", "#2563eb"];

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="relative min-h-screen w-full overflow-hidden bg-background-custom text-text-custom font-sans transition-colors duration-300">
      {/* Global Background */}
      <div className={`fixed inset-0 z-0 ${isDark ? 'bg-black' : ''}`}>
        {isDark ? (
          <div className="w-full h-full opacity-60">
            <DarkVeil 
              speed={0.2} 
              warpAmount={0.5} 
              noiseIntensity={0.03} 
              scanlineIntensity={0.1}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]/80 pointer-events-none"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-[#f8f9fa] relative overflow-hidden">
             <div className="absolute inset-0 opacity-30 saturate-150" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
               <DarkVeil 
                 speed={0.2} 
                 warpAmount={0.5} 
                 noiseIntensity={0.03} 
                 scanlineIntensity={0.1}
               />
             </div>
             
             {/* Engineering Grid for Light Mode */}
             <div 
                className="absolute inset-0 pointer-events-none" 
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                }}
             ></div>

             {/* Soft gradient to ensure text readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/90 pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Fixed Cyber Grid Background (Dark Mode Only) */}
      {isDark && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        ></div>
      )}

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <Hero />
          <About />
          <TechStack theme={theme} />
          <Certifications />
          <Projects />
          <UIUX />
          <Services />
          <Timeline />
          <Contact />
        </div>
      </main>

      <Footer />
      <ChatBot activeSection={activeSection} isDark={isDark} />
      </div>
    </>
  );
}

export default App;
