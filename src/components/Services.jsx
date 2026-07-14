import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, PenTool, Globe, BarChart2, GraduationCap, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: <Layout className="w-7 h-7" />,
    title: 'Full Stack Web Development',
    desc: 'End-to-end web applications using React, Laravel, Node.js, and modern databases.',
    color: 'var(--srv-web)',
    features: ['React / Next.js', 'Laravel / Django', 'REST APIs', 'Database Design'],
  },
  {
    icon: <Server className="w-7 h-7" />,
    title: 'SaaS Development',
    desc: 'Scalable multi-tenant SaaS platforms with subscription billing and admin dashboards.',
    color: 'var(--srv-saas)',
    features: ['Multi-tenancy', 'Billing Systems', 'Role-based Access', 'Analytics'],
  },
  {
    icon: <PenTool className="w-7 h-7" />,
    title: 'UI/UX Design',
    desc: 'Modern, aesthetic, and user-centric interfaces designed and prototyped in Figma.',
    color: 'var(--srv-uiux)',
    features: ['Figma Prototypes', 'Design Systems', 'User Flows', 'Responsive Layouts'],
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Business Websites',
    desc: 'High-converting, blazing-fast landing pages and corporate websites with SEO in mind.',
    color: 'var(--srv-biz)',
    features: ['Landing Pages', 'Corporate Sites', 'SEO Optimized', 'Performance'],
  },
  {
    icon: <BarChart2 className="w-7 h-7" />,
    title: 'Dashboard Systems',
    desc: 'Complex data visualization and management dashboards for administrators and analysts.',
    color: 'var(--srv-dash)',
    features: ['Charts & Graphs', 'Data Tables', 'Real-time Data', 'Admin Panels'],
  },
  {
    icon: <GraduationCap className="w-7 h-7" />,
    title: 'Capstone Systems',
    desc: 'Guiding and developing complete thesis / capstone projects from concept to deployment.',
    color: 'var(--srv-cap)',
    features: ['System Design', 'Documentation', 'Deployment', 'Full Support'],
  },
];

const Services = () => (
  <section className="py-24 relative" id="services">
    <div className="absolute left-1/2 top-1/4 w-96 h-96 rounded-full pointer-events-none -translate-x-1/2"
         style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent)', filter: 'blur(120px)' }}></div>

    <div className="text-center mb-16">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#a78bfa' }}>
        What I offer
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold">
        My <span className="text-gradient">Services</span>
      </motion.h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: (i % 3) * 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden cursor-default glass"
          style={{ transition: 'border-color 0.3s, box-shadow 0.3s' }}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
               style={{ boxShadow: `inset 0 0 0 1px ${s.color}40, 0 20px 60px ${s.color}15` }}></div>
          <div className="absolute top-0 left-0 w-full h-[2px]"
               style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}></div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
               style={{
                 background: `${s.color}18`,
                 border: `1px solid ${s.color}30`,
                 color: s.color,
                 boxShadow: `0 0 0 0 ${s.color}00`,
               }}
               onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${s.color}40`}
               onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${s.color}00`}
          >
            {s.icon}
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-custom mb-2">{s.title}</h3>
            <p className="text-sm text-text-muted-custom leading-relaxed">{s.desc}</p>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border-custom/30">
            {s.features.map((f, j) => (
              <span key={j} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}25` }}>
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Bottom CTA */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 text-center"
    >
      <p className="text-text-muted-custom mb-6">Need something custom? Let's talk about your project.</p>
      <motion.a
        href="#contact"
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-text-custom"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        Start a Project <ArrowRight className="w-4 h-4" />
      </motion.a>
    </motion.div>
  </section>
);

export default Services;
