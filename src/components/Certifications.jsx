import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';
import cert1 from '../assets/CISCO CERT 1.png';
import cert2 from '../assets/CISCO CERT 2.png';

const CERTS = [
  {
    title: 'Cisco Networking Academy',
    issuer: 'Cisco',
    image: cert1,
    link: null, // No link provided
    color: '#059669', // Emerald/Green theme
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco / Credly',
    image: cert2,
    link: 'https://www.credly.com/badges/25dea922-2e0b-478e-8c77-d61aef79a693',
    color: '#2563eb', // Blue theme
  }
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Certifications = () => {
  return (
    <section className="py-24 relative" id="certifications">
      {/* Ambient glow */}
      <div className="absolute left-1/4 top-1/4 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'var(--primary-glow)', filter: 'blur(90px)', opacity: 0.4 }}></div>

      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-semibold tracking-widest uppercase mb-3 text-primary-custom"
        >
          Achievements
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-text-custom"
        >
          My <span className="text-gradient">Certifications</span>
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
      >
        {CERTS.map((cert, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="glass-card flex flex-col group relative overflow-hidden p-6 md:p-8"
          >
            {/* Ambient glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{ background: `radial-gradient(circle at 50% 0%, ${cert.color}15, transparent 70%)` }}></div>
            
            {/* Certificate Image Container */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 relative border" style={{ borderColor: 'var(--border-custom)' }}>
              <img src={cert.image} alt={cert.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
              
              {/* Overlay for link if it exists */}
              {cert.link && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-10">
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                  >
                    Verify Credential <ExternalLink size={18} />
                  </a>
                </div>
              )}
            </div>

            {/* Certificate Details */}
            <div className="flex items-start justify-between gap-4 mt-auto z-10">
              <div>
                <h3 className="text-xl font-bold text-text-custom mb-2">{cert.title}</h3>
                <p className="text-sm text-text-muted-custom flex items-center gap-2">
                  <Award size={16} /> {cert.issuer}
                </p>
              </div>
              
              {/* Mobile link fallback */}
              {cert.link && (
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-full md:hidden"
                  style={{ background: 'var(--surface-custom)', border: '1px solid var(--border-custom)' }}
                >
                  <ExternalLink size={20} className="text-text-custom" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Certifications;
