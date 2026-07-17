import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, BrainCircuit, MonitorSmartphone } from 'lucide-react';

const CARDS = [
  {
    icon: <GraduationCap className="w-7 h-7" style={{ color: '#a78bfa' }} />,
    title: 'IT Student',
    desc: '4th Year Information Technology student mastering software engineering fundamentals.',
    color: '#7c3aed',
  },
  {
    icon: <Code2 className="w-7 h-7" style={{ color: '#60a5fa' }} />,
    title: 'Full Stack Dev',
    desc: 'Building complete systems—robust backends and stunning, performant frontends.',
    color: '#2563eb',
  },
  {
    icon: <BrainCircuit className="w-7 h-7" style={{ color: '#f472b6' }} />,
    title: 'AI Enthusiast',
    desc: 'Exploring computer vision, ML models, and AI-powered application development.',
    color: '#db2777',
  },
  {
    icon: <MonitorSmartphone className="w-7 h-7" style={{ color: '#34d399' }} />,
    title: 'SaaS Builder',
    desc: 'Crafting scalable software-as-a-service platforms for real business problems.',
    color: '#059669',
  },
];

const STATS = [
  { value: '10+', label: 'Projects Built' },
  { value: '6+', label: 'Languages' },
  { value: '4th', label: 'Year IT Student' },
  { value: '∞', label: 'Passion to Learn' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const About = () => {
  return (
    <section className="py-24 relative" id="about">
      {/* Ambient glow */}
      <div className="absolute left-0 top-1/2 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'var(--primary-glow)', filter: 'blur(80px)', transform: 'translateY(-50%)' }}></div>

      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-semibold tracking-widest uppercase mb-3 text-[var(--color-purple-light)]"
        >
          Get to know me
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-text-custom"
        >
          About <span className="text-gradient">Me</span>
        </motion.h2>
      </div>

      {/* Stat Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
      >
        {STATS.map((s, i) => (
          <div key={i} className="glass-card text-center py-6">
            <p className="text-4xl font-extrabold text-gradient mb-1">{s.value}</p>
            <p className="text-sm text-text-muted-custom">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="glass-card flex flex-col gap-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                 style={{ background: `radial-gradient(circle at 30% 30%, ${card.color}18, transparent 70%)` }}></div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{ background: `${card.color}20`, border: `1px solid ${card.color}30` }}>
              {card.icon}
            </div>
            <h3 className="text-lg font-bold text-text-custom">{card.title}</h3>
            <p className="text-sm text-text-muted-custom leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-br from-purple-600/90 to-blue-600/90 dark:from-purple-600/15 dark:to-blue-600/15 border border-purple-500/35 dark:border-purple-500/25 shadow-lg backdrop-blur-md"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent)', filter: 'blur(60px)' }}></div>
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Let's build something amazing<span>.</span>
          </h3>
          <p className="text-purple-100 dark:text-text-muted-custom max-w-lg">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
        </div>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(255,255,255,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 px-8 py-4 rounded-xl font-bold text-black text-sm cursor-pointer z-10 transition-shadow"
          style={{ background: 'white' }}
        >
          Hire Me →
        </motion.a>
      </motion.div>
    </section>
  );
};

export default About;

