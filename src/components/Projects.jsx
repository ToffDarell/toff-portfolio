import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

const PROJECTS = [
  {
    id: 1,
    title: 'Homeroom Management System',
    desc: 'Student and classroom management system built with robust data structures and file handling.',
    tech: ['C Language'],
    color: '#A8B9CC',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    link: 'https://github.com/ToffDarell/Homeroom-Management-System',
    date: 'Jan 2023',
    category: 'System',
  },
  {
    id: 2,
    title: 'Blackout Esports Reservation System',
    desc: 'Computer reservation system with QR-based bookings and integrated payment features for an esports lounge.',
    tech: ['PHP', 'MySQL', 'JavaScript'],
    color: '#F7DF1E',
    image: '/projects/blackout.png',
    link: 'https://github.com/ToffDarell/BLACKOUTESPORTS',
    date: 'Apr 2023',
    category: 'Web App',
  },
  {
    id: 3,
    title: 'Malaybalay Skyfall',
    desc: 'An exciting dodging bird game developed completely in Java featuring custom graphics and mechanics.',
    tech: ['Java'],
    color: '#007396',
    image: '/projects/skyfall.png',
    link: 'https://github.com/ToffDarell/DODGING-BIRD-GAME',
    date: 'Jul 2023',
    category: 'Game',
  },
  {
    id: 4,
    title: 'CPAG Research Archive',
    desc: 'MERN stack academic archive and monitoring platform for masteral research documents and progress tracking.',
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    color: '#47A248',
    image: '/projects/cpag.png',
    link: 'https://github.com/ToffDarell/CPAG-Graduates-Research-Monitoring-System',
    date: 'Oct 2023',
    category: 'Archive',
  },
  {
    id: 5,
    title: 'PayMonitor Lending SaaS',
    desc: 'Multi-tenant lending and payment monitoring SaaS platform for cooperatives and small lending institutions.',
    tech: ['Laravel', 'MySQL', 'Tailwind', 'Alpine.js'],
    color: '#FF2D20',
    image: '/projects/paymonitor.png',
    link: 'https://github.com/ToffDarell/PayMonitor-',
    date: 'Jan 2024',
    category: 'SaaS',
  },
  {
    id: 6,
    title: 'SafeRide Helmet Detection',
    desc: 'AI-powered helmet detection and license plate recognition system using YOLO and computer vision.',
    tech: ['YOLO', 'Python', 'OpenCV', 'PyTorch'],
    color: '#EE4C2C',
    image: '/projects/saferide.png',
    link: 'https://github.com/ToffDarell/SAFERIDEWEB',
    date: 'Mar 2024',
    category: 'AI / CV',
  },
  {
    id: 7,
    title: 'Mugna Arts E-Commerce',
    desc: 'Modern e-commerce platform for leather products and handcrafted items with a premium shopping experience.',
    tech: ['Laravel', 'React', 'Tailwind CSS'],
    color: '#F24E1E',
    image: '/projects/mugna.png',
    link: 'https://github.com/ToffDarell/-Mugna-Leather-Arts',
    date: 'May 2024',
    category: 'E-Commerce',
  },
  {
    id: 8,
    title: 'Smart Barangay Services',
    desc: 'Community-focused digital services and resident management system for local government operations.',
    tech: ['PHP', 'MySQL', 'Alpine.js'],
    color: '#3b82f6',
    image: '/projects/barangay.png',
    link: 'https://github.com/ToffDarell/Barangay-Smart-Services',
    date: 'Jun 2024',
    category: 'Gov Tech',
  },
];

const Projects = () => {
  return (
    <section className="py-24 relative" id="projects">
      <div className="absolute left-0 top-1/2 w-96 h-96 rounded-full pointer-events-none -translate-y-1/2"
           style={{ background: 'var(--primary-glow)', filter: 'blur(100px)' }}></div>

      <div className="text-center mb-16 relative z-10">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-sm font-semibold tracking-widest uppercase mb-3 text-primary-custom">
          What I've built
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-text-custom mb-8">
          Featured <span className="text-gradient">Projects</span>
        </motion.h2>
      </div>

      <div className="min-h-[600px] relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
              className="group flex flex-col rounded-2xl overflow-hidden relative cursor-pointer"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(20px)',
                transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
              }}
              whileHover={{
                y: -8,
                boxShadow: `0 20px 40px ${p.color}15`,
                transition: { duration: 0.3 },
              }}
            >
              <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}></div>

              <div className="relative h-44 overflow-hidden">
                <div className="absolute inset-0 z-10 transition-opacity duration-300 bg-black/35"></div>
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.a href={p.link} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                    style={{ background: p.color, boxShadow: `0 0 20px ${p.color}60` }}>
                    <FaGithub className="w-4 h-4" /> View on GitHub
                  </motion.a>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-text-custom mb-2 group-hover:text-primary-custom transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-text-muted-custom leading-relaxed flex-grow mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {p.tech.map((t, j) => (
                    <span key={j} className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
