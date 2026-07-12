import React, { useState, useEffect } from 'react';
import Particles from './components/Particles';
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

function App() {
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

  const isDark = theme === 'dark';

  const particleColors = isDark
    ? ["#7c3aed", "#2563eb", "#a855f7", "#3b82f6"]
    : ["#1e293b", "#3b82f6", "#475569", "#2563eb"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background-custom text-text-custom font-sans transition-colors duration-300">
      {/* Fixed Particle Background */}
      <div className="fixed inset-0 z-0">
        <Particles
          particleColors={particleColors}
          particleCount={isDark ? 280 : 160}
          particleSpread={isDark ? 15 : 18}
          speed={isDark ? 0.05 : 0.03}
          particleBaseSize={isDark ? 80 : 45}
          moveParticlesOnHover={true}
          particleHoverFactor={isDark ? 2 : 1.2}
          alphaParticles={true}
          sizeRandomness={1.5}
          cameraDistance={25}
        />
      </div>

      {/* Fixed Cyber Grid Background */}
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
    </div>
  );
}

export default App;
