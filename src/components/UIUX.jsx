import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react'; import { FaGithub, FaFigma } from 'react-icons/fa';

const DESIGNS = [
  {
    title: 'FinTech Dashboard',
    subtitle: 'Analytics & Reporting UI',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=900&q=80',
    color: '#7c3aed',
  },
  {
    title: 'E-Commerce Web App',
    subtitle: 'Shopping Experience Design',
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=900&q=80',
    color: '#2563eb',
    link: 'https://www.figma.com/proto/XmJUiQ8szBk3HCxHVLpJOy/hci-prototype?node-id=1-3&starting-point-node-id=1%3A3&t=OxZFXmnnee1ZUaj7-1'
  },
  {
    title: 'SaaS Landing Page',
    subtitle: 'Conversion-Focused Layout',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    color: '#db2777',
  },
  {
    title: 'Smart Home Interface',
    subtitle: 'IoT Dashboard & Controls',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
    color: '#059669',
  },
];

const UIUX = () => (
  <section className="py-24 relative" id="uiux">
    <div className="absolute right-0 top-1/2 w-80 h-80 rounded-full pointer-events-none"
         style={{ background: 'var(--primary-glow)', filter: 'blur(100px)' }}></div>

    <div className="text-center mb-16">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-sm font-semibold tracking-widest uppercase mb-3 text-[var(--color-purple-light)]">
        Design work
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-text-custom">
        UI / UX <span className="text-gradient">Showcase</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.15 }} className="text-text-muted-custom mt-4 max-w-xl mx-auto">
        Crafting intuitive, beautiful interfaces in Figma from wireframes to high-fidelity prototypes.
      </motion.p>
    </div>

    {/* 2-col masonry-ish grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {DESIGNS.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.93 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: (i % 2) * 0.12 }}
          className="group relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            border: '1px solid var(--glass-border)',
            aspectRatio: '16/9',
          }}
        >
          {/* Image */}
          <img
            src={d.image}
            alt={d.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ opacity: 0.75, filter: 'brightness(0.85)' }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 transition-opacity duration-500"
               style={{ background: `linear-gradient(180deg, transparent 30%, rgba(3,0,20,0.85) 100%)` }}></div>

          {/* Glow border on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
               style={{ boxShadow: `inset 0 0 0 1.5px ${d.color}` }}></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
            <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-1">
                <FaFigma className="w-4 h-4" style={{ color: d.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: d.color }}>
                  Figma Prototype
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-text-custom">{d.title}</h3>
              <p className="text-sm text-text-muted-custom opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                {d.subtitle}
              </p>
            </div>
            <motion.a
              href={d.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => !d.link && e.preventDefault()}
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: d.color }}
            >
              <ExternalLink className="w-4 h-4 text-text-custom" />
            </motion.a>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default UIUX;
