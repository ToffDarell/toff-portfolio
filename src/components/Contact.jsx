import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, MapPin, CheckCircle, Loader, Paperclip } from 'lucide-react';
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Opens Gmail with device-specific deep links.
// iOS: googlegmail:///co opens Gmail app directly (no "Sent from my iPhone")
// Android: intent:// forces Gmail app instead of browser
// Desktop: Gmail web compose URL
const GMAIL_TO = 'topedarell13@gmail.com';
const getEmailLink = (subject, body) => {
  if (typeof window === 'undefined') return '';
  const ua = navigator.userAgent;
  const encodedTo = encodeURIComponent(GMAIL_TO);
  const encodedSu = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // iOS — Gmail app URL scheme
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return `googlegmail:///co?to=${encodedTo}&su=${encodedSu}&body=${encodedBody}`;
  }

  // Android — intent URL forces Gmail app via SENDTO action
  if (/Android/i.test(ua)) {
    return `mailto:${GMAIL_TO}?subject=${encodedSu}&body=${encodedBody}#Intent;action=android.intent.action.SENDTO;type=message/rfc822;package=com.google.android.gm;end`;
  }

  // Desktop — Gmail web compose
  return `https://mail.google.com/mail/?view=cm&to=${encodedTo}&su=${encodedSu}&body=${encodedBody}`;
};

const Contact = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');

  // Form submission via EmailJS (no Gmail redirection for plain text messages)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus('sent');
      formRef.current.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputStyle = {
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-custom)',
  };

  const onFocus = (e) => {
    e.target.style.borderColor = 'rgba(124,58,237,0.6)';
    e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.15)';
  };

  const onBlur = (e) => {
    e.target.style.borderColor = 'var(--glass-border)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <section className="py-24 relative" id="contact">
      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[400px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.12), transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-sm font-semibold tracking-widest uppercase mb-3"
          style={{ color: '#a78bfa' }}
        >
          Let's work together
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold"
        >
          Get in <span className="text-gradient">Touch</span>
        </motion.h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">

        {/* Left: Info panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 flex flex-col gap-5"
        >
          <div className="rounded-2xl p-6 flex flex-col gap-6 glass">
            <div>
              <h3 className="text-xl font-extrabold text-text-custom mb-2">Contact Info</h3>
              <p className="text-sm text-text-muted-custom leading-relaxed">
                Available for freelance, internships, and exciting projects. Let's create something great.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Link */}
              <motion.a
                href={getEmailLink("Project Inquiry / Let's Collaborate!", "Hi Toff,\n\nI found your portfolio and would love to chat about a potential project, internship, or collaboration opportunity!\n\nHere is what's on my mind:\n- What I want to build/discuss: \n- Best way to reach back: \n\nTalk soon!")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-3 rounded-xl transition-all group cursor-pointer"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.2)' }}>
                  <Mail className="w-5 h-5" style={{ color: '#a78bfa' }} />
                </div>
                <div>
                  <p className="text-xs text-text-muted-custom mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-text-custom group-hover:text-purple-300 transition-colors">topedarell13@gmail.com</p>
                </div>
              </motion.a>

              {/* PDF/Proposal Link -> direct to Gmail with instructions to attach */}
              <motion.a
                href={getEmailLink('Project Proposal & Documentation', "Hi Toff,\n\nI have a project proposal, wireframe, or scope document I'd like to share with you!\n\nI've attached the file to this email. Here are the quick details:\n- Project Name: \n- Estimated Timeline/Budget: \n- Brief Overview: \n\n(Please click the attachment icon below in Gmail to upload your PDF/file!)")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-3 rounded-xl transition-all group cursor-pointer text-left"
                style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.2)' }}>
                  <Paperclip className="w-5 h-5" style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <p className="text-xs text-text-muted-custom mb-0.5">Have a proposal?</p>
                  <p className="text-sm font-semibold text-text-custom group-hover:text-blue-300 transition-colors">Send proposal PDF via Gmail</p>
                </div>
              </motion.a>

              {/* Location */}
              <div className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.2)' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <p className="text-xs text-text-muted-custom mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-text-custom">Philippines 🇵🇭</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-5">
              <p className="text-xs text-text-muted-custom mb-4 uppercase tracking-wider font-semibold">Connect</p>
              <div className="flex gap-3">
                {[
                  { icon: <FaGithub className="w-5 h-5" />, href: 'https://github.com/ToffDarell', label: 'GitHub', color: '#ffffff', bg: 'rgba(255,255,255,0.1)' },
                  { icon: <FaLinkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/in/toff-darell-vergara-839462408/', label: 'LinkedIn', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
                  { icon: <FaFacebook className="w-5 h-5" />, href: 'https://www.facebook.com/toffdarell', label: 'Facebook', color: '#2563eb', bg: 'rgba(37,99,235,0.15)' },
                  { icon: <FaInstagram className="w-5 h-5" />, href: 'https://www.instagram.com/topewooo/', label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.15)' },
                ].map(({ icon, href, label, color, bg }, i) => (
                  <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    whileHover={{ scale: 1.15, y: -3 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{ background: bg, border: `1px solid ${color}30`, color }}
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-3 rounded-2xl p-7 flex flex-col gap-5 glass"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-custom">Your Name</label>
              <input
                type="text"
                name="from_name"
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl text-text-custom placeholder-gray-600 text-sm outline-none transition-all duration-300"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-custom">Your Email</label>
              <input
                type="email"
                name="from_email"
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-text-custom placeholder-gray-600 text-sm outline-none transition-all duration-300"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-custom">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="What's this about?"
              className="w-full px-4 py-3 rounded-xl text-text-custom placeholder-gray-600 text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-custom">Message</label>
            <textarea
              rows={5}
              name="message"
              placeholder="Tell me about your project..."
              required
              className="w-full px-4 py-3 rounded-xl text-text-custom placeholder-gray-600 text-sm outline-none transition-all resize-none"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-400 text-center">Something went wrong. Please try again or email me directly.</p>
          )}

          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.5)' } : {}}
            whileTap={status === 'idle' ? { scale: 0.98 } : {}}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            style={{
              background:
                status === 'sent'    ? 'rgba(5,150,105,0.9)' :
                status === 'error'   ? 'rgba(220,38,38,0.8)' :
                'linear-gradient(135deg, #7c3aed, #2563eb)',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              opacity: status === 'sending' ? 0.7 : 1,
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'sending' && <><Loader className="w-5 h-5 animate-spin" /> Sending...</>}
            {status === 'sent'    && <><CheckCircle className="w-5 h-5" /> Message Sent!</>}
            {status === 'error'   && <>Failed — Try Again</>}
            {status === 'idle'    && <><Send className="w-5 h-5" /> Send Message</>}
          </motion.button>
        </motion.form>

      </div>
    </section>
  );
};

export default Contact;
