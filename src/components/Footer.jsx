import React from 'react';
import { Code2, Heart } from 'lucide-react'; import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaFigma } from 'react-icons/fa';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Tech', href: '#tech' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { icon: <FaGithub className="w-5 h-5" />, href: 'https://github.com/ToffDarell', label: 'GitHub Profile', color: '#ffffff' },
  { icon: <FaLinkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/in/toff-darell-vergara-839462408/', label: 'LinkedIn Profile', color: '#3b82f6' },
  { icon: <FaFacebook className="w-5 h-5" />, href: 'https://www.facebook.com/toffdarell', label: 'Facebook Profile', color: '#2563eb' },
  { icon: <FaInstagram className="w-5 h-5" />, href: 'https://www.instagram.com/topewooo/', label: 'Instagram Profile', color: '#E1306C' },
];

const Footer = () => (
  <footer className="relative z-10 w-full mt-12 glass"
          style={{ borderTop: '1px solid var(--border-custom)' }}>
    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <a href="#" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Code2 className="w-5 h-5 text-text-custom" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-text-custom">
              TOFF<span style={{ color: '#7c3aed' }}>.</span>
            </span>
          </a>
          <p className="text-sm text-text-muted-custom leading-relaxed max-w-xs">
            Aspiring Full Stack Developer &amp; IT student passionate about engineering modern digital experiences.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ icon, href, label, color }, i) => (
              <a key={i} href={href} aria-label={label}
                 className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-1"
                 style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
                 onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = `${color}40`; }}
                 onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#a78bfa' }}>Navigation</p>
          <ul className="space-y-3">
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                   className="text-sm text-text-muted-custom transition-colors duration-200 hover:text-text-custom flex items-center gap-2 group">
                  <span className="w-4 h-px transition-all duration-300 group-hover:w-6"
                        style={{ background: '#7c3aed' }}></span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#a78bfa' }}>Ready to build?</p>
          <p className="text-sm text-text-muted-custom leading-relaxed mb-5">
            Let's turn your ideas into reality. I'm just one message away.
          </p>
          <a href="#contact"
             className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-text-custom text-sm transition-all hover:scale-105"
             style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
            Get in Touch →
          </a>
        </div>

      </div>

      {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border-custom/30">
          <p className="text-xs text-text-muted-custom">
            &copy; {new Date().getFullYear()} Toff. All rights reserved.
          </p>
      </div>
    </div>
  </footer>
);

export default Footer;
