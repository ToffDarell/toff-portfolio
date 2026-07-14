import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Download } from 'lucide-react';
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import resume from '../assets/Toff Darell B. Vergara — Resume.pdf';

const ROLES = ['Full Stack Developer', 'Software Engineer', 'SaaS Developer', 'AI Enthusiast'];

const Hero = () => {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRoleIdx(p => (p + 1) % ROLES.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center pt-24 pb-12 gap-16">
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 w-full max-w-7xl">
        
        {/* ── Left: Text ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full lg:w-1/2 flex flex-col items-start space-y-6"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-text-custom">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Toff</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xl sm:text-2xl font-medium text-text-muted-custom h-9" aria-live="polite" aria-label="Current role">
            <span>I build as a</span>
            <AnimatedRole role={ROLES[roleIdx]} />
          </div>

          <p className="text-base sm:text-lg text-text-muted-custom max-w-xl leading-relaxed">
            Aspiring Full Stack Developer building modern web applications, SaaS platforms,
            AI-powered systems, and digital solutions. 3rd Year IT student passionate about engineering the future.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <motion.a
              href={resume}
              download="Toff_Darell_Vergara_Resume.pdf"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white group transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }}
            >
              <Download className="w-5 h-5" />
              Download CV
            </motion.a>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-text-custom hover:border-purple-500/50 transition-all cursor-pointer"
            >
              View Projects
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-6 pt-6">
            {[
              { icon: <FaGithub className="w-6 h-6" />, href: 'https://github.com/ToffDarell', hover: '#a855f7' },
              { icon: <FaLinkedin className="w-6 h-6" />, href: 'https://www.linkedin.com/in/toff-darell-vergara-839462408/', hover: '#3b82f6' },
              { icon: <FaFacebook className="w-6 h-6" />, href: 'https://www.facebook.com/toffdarell', hover: '#2563eb' },
              { icon: <FaInstagram className="w-6 h-6" />, href: 'https://www.instagram.com/topewooo/', hover: '#E1306C' },
            ].map(({ icon, href, hover }, i) => (
              <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2, color: hover }}
                 className="text-text-muted-custom transition-colors duration-300 cursor-pointer">
                {icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Minimal Profile Image ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative group"
        >
          {/* Ambient Glow behind the image */}
          <div className="absolute w-64 h-80 sm:w-72 sm:h-96 rounded-2xl bg-purple-600/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative group w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.1)] border border-white/10 hover:border-purple-500/30 transition-all duration-500">
            {/* The Image */}
            <img
              src="/profile.jpg"
              alt="Toff - Developer"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle overlay gradient to ensure it blends with dark theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
            
            {/* Minimal Name Tag */}
            <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-wide text-lg">Toff Darell</span>
                <span className="text-purple-400 text-sm font-medium">Full Stack Developer</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AnimatedRole = ({ role }) => (
  <motion.span
    key={role}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
  >
    {role}
  </motion.span>
);

export default Hero;
