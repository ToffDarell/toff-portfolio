import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Cpu, Rocket, Bot } from 'lucide-react';

const EVENTS = [
  {
    period: '2022 — The Beginning',
    title: 'Learning Programming',
    desc: 'Started the journey with algorithms, data structures, and the C language — laying the foundation for everything that followed.',
    color: 'var(--srv-web)',
    icon: <Sprout className="w-5 h-5" style={{ color: 'var(--srv-web)' }} />,
  },
  {
    period: '2023 — Building Phase',
    title: 'Developing Systems',
    desc: 'Created early management systems, local reservation platforms, and mastered PHP & MySQL full-stack development.',
    color: 'var(--srv-saas)',
    icon: <Cpu className="w-5 h-5" style={{ color: 'var(--srv-saas)' }} />,
  },
  {
    period: '2024 — SaaS & Web Era',
    title: 'Modern Full Stack & SaaS',
    desc: 'Built complex platforms — PayMonitor Lending SaaS, MERN stack research archives, and professional Laravel applications.',
    color: 'var(--srv-uiux)',
    icon: <Rocket className="w-5 h-5" style={{ color: 'var(--srv-uiux)' }} />,
  },
  {
    period: '2025 — Current Focus',
    title: 'AI, Vision & Infrastructure',
    desc: 'Exploring computer vision with YOLO, AI/ML integration, Cisco networking, and Raspberry Pi embedded projects.',
    color: 'var(--srv-dash)',
    icon: <Bot className="w-5 h-5" style={{ color: 'var(--srv-dash)' }} />,
  },
];

const Timeline = () => (
  <section className="py-24 relative" id="timeline">
    <div className="absolute left-1/2 top-0 w-px h-full pointer-events-none -translate-x-1/2 hidden md:block"
         style={{ background: 'var(--border-custom)' }}></div>

    <div className="text-center mb-16">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-sm font-semibold tracking-widest uppercase mb-3 text-primary-custom">
        How I got here
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-text-custom">
        My <span className="text-gradient">Journey</span>
      </motion.h2>
    </div>

    <div className="max-w-4xl mx-auto relative">
      {/* Animated vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
           style={{ background: 'var(--border-custom)' }}>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(to bottom, #7c3aed, #2563eb, #db2777, #f59e0b)' }}
          className="w-full"
        />
      </div>

      <div className="space-y-12">
        {EVENTS.map((ev, i) => {
          const isRight = i % 2 === 0;
          return (
            <div key={i} className="relative flex items-start md:items-center gap-0">
              {/* Node dot */}
              <div
                className="absolute left-4 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10 flex items-center justify-center"
                style={{
                  background: ev.color,
                  boxShadow: `0 0 15px ${ev.color}80`,
                  border: '2px solid var(--bg-custom)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
              </div>

              {/* Card — alternating sides on desktop */}
              <motion.div
                initial={{ opacity: 0, x: isRight ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`ml-12 md:ml-0 md:w-5/12 ${isRight ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}
              >
                <div
                  className="group rounded-2xl p-5 relative overflow-hidden glass transition-all"
                  style={{
                    border: `1px solid ${ev.color}40`,
                  }}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                       style={{ background: `radial-gradient(circle at 0% 100%, ${ev.color}12, transparent 70%)` }}></div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg"
                          style={{ background: `${ev.color}15`, border: `1px solid ${ev.color}25` }}>
                      {ev.icon}
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: ev.color }}>
                      {ev.period}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-text-custom mb-2">{ev.title}</h3>
                  <p className="text-sm text-text-muted-custom leading-relaxed">{ev.desc}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Timeline;

