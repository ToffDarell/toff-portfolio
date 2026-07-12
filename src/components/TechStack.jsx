import React from 'react';
import { motion } from 'framer-motion';
import LogoLoop from './LogoLoop';
import {
  SiC, SiJavascript, SiTypescript, SiPython, SiPhp,
  SiSass, SiReact, SiVite, SiTailwindcss, SiAlpinedotjs,
  SiLaravel, SiDjango, SiWordpress, SiApache,
  SiMysql, SiMongodb, SiFirebase, SiVercel, SiRender,
  SiPytorch, SiTensorflow, SiNumpy, SiOpencv,
  SiGit, SiGithub, SiFigma, SiCanva, SiCisco, SiRaspberrypi
} from 'react-icons/si';
import { FaJava, FaCss3Alt, FaHtml5 } from 'react-icons/fa';

const allLogos = [
  { node: <SiJavascript color="#F7DF1E" />, title: 'JavaScript' },
  { node: <SiTypescript color="#3178C6" />, title: 'TypeScript' },
  { node: <SiReact color="#61DAFB" />, title: 'React' },
  { node: <SiTailwindcss color="#06B6D4" />, title: 'Tailwind' },
  { node: <SiPython color="#3776AB" />, title: 'Python' },
  { node: <SiPhp color="#777BB4" />, title: 'PHP' },
  { node: <SiLaravel color="#FF2D20" />, title: 'Laravel' },
  { node: <SiMysql color="#4479A1" />, title: 'MySQL' },
  { node: <SiPytorch color="#EE4C2C" />, title: 'PyTorch' },
  { node: <SiFigma color="#F24E1E" />, title: 'Figma' },
  { node: <SiC color="#A8B9CC" />, title: 'C' },
  { node: <FaJava color="#007396" />, title: 'Java' },
  { node: <SiMongodb color="#47A248" />, title: 'MongoDB' },
  { node: <SiGithub color="#ffffff" />, title: 'GitHub' },
  { node: <SiFirebase color="#FFCA28" />, title: 'Firebase' },
  { node: <SiDjango color="#44B78B" />, title: 'Django' },
  { node: <SiTensorflow color="#FF6F00" />, title: 'TensorFlow' },
  { node: <SiVercel color="#ffffff" />, title: 'Vercel' },
  { node: <FaHtml5 color="#E34F26" />, title: 'HTML5' },
  { node: <FaCss3Alt color="#1572B6" />, title: 'CSS3' },
];

const CATEGORIES = [
  {
    name: 'Languages',
    color: '#7c3aed',
    techs: [
      { icon: <SiC color="#A8B9CC" />, name: 'C' },
      { icon: <FaJava color="#007396" />, name: 'Java' },
      { icon: <SiJavascript color="#F7DF1E" />, name: 'JavaScript' },
      { icon: <SiTypescript color="#3178C6" />, name: 'TypeScript' },
      { icon: <SiPython color="#3776AB" />, name: 'Python' },
      { icon: <SiPhp color="#777BB4" />, name: 'PHP' },
    ],
  },
  {
    name: 'Frontend',
    color: '#2563eb',
    techs: [
      { icon: <FaHtml5 color="#E34F26" />, name: 'HTML5' },
      { icon: <FaCss3Alt color="#1572B6" />, name: 'CSS3' },
      { icon: <SiReact color="#61DAFB" />, name: 'React' },
      { icon: <SiVite color="#646CFF" />, name: 'Vite' },
      { icon: <SiTailwindcss color="#06B6D4" />, name: 'Tailwind' },
      { icon: <SiAlpinedotjs color="#8BC0D0" />, name: 'Alpine.js' },
    ],
  },
  {
    name: 'Backend & Frameworks',
    color: '#db2777',
    techs: [
      { icon: <SiLaravel color="#FF2D20" />, name: 'Laravel' },
      { icon: <SiDjango color="#44B78B" />, name: 'Django' },
      { icon: <SiApache color="#D22128" />, name: 'Apache' },
    ],
  },
  {
    name: 'Databases & Cloud',
    color: '#059669',
    techs: [
      { icon: <SiMysql color="#4479A1" />, name: 'MySQL' },
      { icon: <SiMongodb color="#47A248" />, name: 'MongoDB' },
      { icon: <SiFirebase color="#FFCA28" />, name: 'Firebase' },
      { icon: <SiVercel color="#ffffff" />, name: 'Vercel' },
      { icon: <SiRender color="#46E3B7" />, name: 'Render' },
    ],
  },
  {
    name: 'AI / ML',
    color: '#f59e0b',
    techs: [
      { icon: <SiPytorch color="#EE4C2C" />, name: 'PyTorch' },
      { icon: <SiTensorflow color="#FF6F00" />, name: 'TensorFlow' },
      { icon: <SiNumpy color="#4DABCF" />, name: 'NumPy' },
      { icon: <SiOpencv color="#5C3EE8" />, name: 'OpenCV' },
    ],
  },
  {
    name: 'Tools & Others',
    color: '#64748b',
    techs: [
      { icon: <SiGit color="#F05032" />, name: 'Git' },
      { icon: <SiGithub color="#ffffff" />, name: 'GitHub' },
      { icon: <SiFigma color="#F24E1E" />, name: 'Figma' },
      { icon: <SiCanva color="#00C4CC" />, name: 'Canva' },
      { icon: <SiCisco color="#1BA0D7" />, name: 'Cisco' },
      { icon: <SiRaspberrypi color="#A22846" />, name: 'Raspberry Pi' },
    ],
  },
];

const TechStack = ({ theme }) => {
  const isDark = theme === 'dark';
  const fadeColor = isDark ? '#030014' : '#FAFAFA';

  return (
    <section className="py-24 relative" id="tech">
      <div className="absolute right-0 top-1/3 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: 'var(--primary-glow)', filter: 'blur(100px)' }}></div>

      {/* Header */}
      <div className="text-center mb-16">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-sm font-semibold tracking-widest uppercase mb-3 text-primary-custom">
          What I work with
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-text-custom">
          Tech <span className="text-gradient">Stack</span>
        </motion.h2>
      </div>

      {/* Infinite Logo Scroller */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 rounded-2xl overflow-hidden py-6"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
      >
        <LogoLoop
          logos={allLogos}
          speed={55}
          direction="left"
          logoHeight={46}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor={fadeColor}
          ariaLabel="Tech stack logos"
        />
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: (i % 3) * 0.1 }}
            className="glass-card relative overflow-hidden group"
          >
            {/* Category glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                 style={{ background: `radial-gradient(circle at 0% 0%, ${cat.color}15, transparent 60%)` }}></div>

            <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid var(--border-custom)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: cat.color }}></span>
              <h3 className="text-base font-bold text-text-custom">{cat.name}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.techs.map((tech, j) => (
                <motion.div
                  key={j}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-text-custom cursor-default transition-all"
                  style={{
                    background: 'var(--surface-custom)',
                    border: '1px solid var(--border-custom)',
                  }}
                >
                  <span className="text-base leading-none">{tech.icon}</span>
                  {tech.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
