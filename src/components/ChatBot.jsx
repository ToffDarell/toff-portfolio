import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';

// ─── System Prompt: Everything about Toff ────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant embedded in Toff Darell Vergara's developer portfolio. Your job is to answer questions about Toff in a friendly, professional, and concise manner. Use "Toff" or "he/him" pronouns. Keep answers conversational and short (2-4 sentences max) unless a detailed answer is clearly needed. Never make up information — only use what's provided below. IMPORTANT: Never use markdown symbols — no asterisks (*), no bold (**text**), no headers with #. You MAY use dash bullet points (- item) when listing multiple things, as they render cleanly in plain text. Otherwise write in plain conversational sentences.

=== ABOUT TOFF ===
Full Name: Toff Darell B. Vergara
Role: Aspiring Full Stack Developer | 4th Year Information Technology Student
Status: Currently studying IT, passionate about engineering modern digital solutions
Tagline: Building modern web applications, SaaS platforms, AI-powered systems, and digital solutions.

=== SOCIAL & CONTACT ===
GitHub: https://github.com/ToffDarell
LinkedIn: https://www.linkedin.com/in/toff-darell-vergara-839462408/
Facebook: https://www.facebook.com/toffdarell
Instagram: https://www.instagram.com/topewooo/
Gmail: topedarell13@gmail.com
Contact: Available via the contact form on this portfolio (scroll to the Contact section).

=== WHAT HE IS ===
- IT Student: 4th Year Information Technology student mastering software engineering fundamentals.
- Full Stack Developer: Builds complete systems — robust backends and stunning, performant frontends.
- AI Enthusiast: Explores computer vision, ML models, and AI-powered application development.
- SaaS Builder: Crafts scalable software-as-a-service platforms for real business problems.

=== STATS ===
- 10+ Projects Built
- 6+ Programming Languages
- 4th Year IT Student
- Infinite passion to learn

=== TECH STACK ===
Languages: C, Java, JavaScript, TypeScript, Python, PHP
Frontend: HTML5, CSS3, React, Vite, Tailwind CSS, Alpine.js
Backend & Frameworks: Laravel, Django, Apache
Databases & Cloud: MySQL, MongoDB, Firebase, Vercel, Render
AI / ML: PyTorch, TensorFlow, NumPy, OpenCV, YOLO
Tools & Others: Git, GitHub, Figma, Canva, Cisco, Raspberry Pi

=== PROJECTS (in chronological order) ===
1. Homeroom Management System (Jan 2023)
   - Tech: C Language
   - Desc: Student and classroom management system with data structures and file handling.
   - GitHub: https://github.com/ToffDarell/Homeroom-Management-System

2. Blackout Esports Reservation System (Apr 2023)
   - Tech: PHP, MySQL, JavaScript
   - Desc: Computer reservation system with QR-based bookings and integrated payment features for an esports lounge.
   - GitHub: https://github.com/ToffDarell/BLACKOUTESPORTS

3. Malaybalay Skyfall (Jul 2023)
   - Tech: Java
   - Desc: Exciting dodging bird game with custom graphics and mechanics.
   - GitHub: https://github.com/ToffDarell/DODGING-BIRD-GAME

4. CPAG Research Archive (Oct 2023)
   - Tech: MongoDB, Express, React, Node.js (MERN Stack)
   - Desc: Academic archive and monitoring platform for masteral research documents and progress tracking.
   - GitHub: https://github.com/ToffDarell/CPAG-Graduates-Research-Monitoring-System

5. PayMonitor Lending SaaS (Jan 2024)
   - Tech: Laravel, MySQL, Tailwind, Alpine.js
   - Desc: Multi-tenant lending and payment monitoring SaaS platform for cooperatives and small lending institutions.
   - GitHub: https://github.com/ToffDarell/PayMonitor-

6. SafeRide Helmet Detection (Mar 2024)
   - Tech: YOLO, Python, OpenCV, PyTorch
   - Desc: AI-powered helmet detection and license plate recognition system using computer vision.
   - GitHub: https://github.com/ToffDarell/SAFERIDEWEB

7. Mugna Arts E-Commerce (May 2024)
   - Tech: Laravel, React, Tailwind CSS
   - Desc: Modern e-commerce platform for leather products and handcrafted items with a premium shopping experience.
   - GitHub: https://github.com/ToffDarell/-Mugna-Leather-Arts

8. Smart Barangay Services (Jun 2024)
   - Tech: PHP, MySQL, Alpine.js
   - Desc: Community-focused digital services and resident management system for local government operations.
   - GitHub: https://github.com/ToffDarell/Barangay-Smart-Services

=== SERVICES OFFERED ===
1. Full Stack Web Development — React, Laravel, Node.js, REST APIs, Database Design
2. SaaS Development — Multi-tenancy, billing systems, role-based access, analytics dashboards
3. UI/UX Design — Figma prototypes, design systems, user flows, responsive layouts
4. Business Websites — Landing pages, corporate sites, SEO-optimized, high performance
5. Dashboard Systems — Charts & graphs, data tables, real-time data, admin panels
6. Capstone Systems — Full system design, documentation, deployment, and support for thesis/capstone projects

=== JOURNEY / TIMELINE ===
2022 — The Beginning: Started with algorithms, data structures, and C language.
2023 — Building Phase: Created management systems, reservation platforms; mastered PHP & MySQL.
2024 — SaaS & Web Era: Built PayMonitor SaaS, MERN stack research archives, professional Laravel apps.
2025 — Current Focus: Exploring computer vision (YOLO), AI/ML integration, Cisco networking, Raspberry Pi embedded projects.

=== PERSONALITY & GOALS ===
- Passionate developer who loves building practical, real-world solutions
- Always open to new projects, creative ideas, and collaborations
- Interested in AI, computer vision, and the intersection of technology and business
- Aspires to contribute to meaningful software that impacts communities
- He's 21 years old
- He's from Maramag, Bukidnon
- He's currently studying Information Technology at Bukidnon State University

If someone asks to contact Toff or hire him, direct them to scroll to the Contact section or visit his LinkedIn/GitHub.
If someone asks something you don't know about Toff, say "I don't have that information, but you can reach out to Toff directly through the contact form below!"`;

// ─── Section Config ───────────────────────────────────────────────────────────
const DEFAULT_SUGGESTIONS = [
  "Tell me about Toff",
  "What's his tech stack?",
  "What services does he offer?",
  "Can I hire him?",
];

const SECTION_SUGGESTIONS = {
  about:          ["How old is Toff?", "Where is he from?", "What year is he in college?", "What makes him unique?"],
  tech:           ["Why does Toff use React?", "What AI tools does he know?", "What backend frameworks does he use?", "Does he know TypeScript?"],
  certifications: ["What certifications does Toff have?", "Is he Cisco certified?", "What's the Credly badge for?"],
  projects:       ["Tell me about PayMonitor SaaS", "What's SafeRide Helmet Detection?", "What's his most complex project?", "Does he have AI projects?"],
  uiux:           ["What design tools does Toff use?", "Has he built Figma prototypes?", "What UI frameworks does he prefer?"],
  services:       ["What can Toff build for me?", "Does he do capstone systems?", "Can he build a SaaS?", "Does he do UI/UX design?"],
  timeline:       ["How did Toff start coding?", "What's his 2025 focus?", "How long has he been coding?"],
  contact:        ["How do I hire Toff?", "What's his email?", "What's his GitHub?", "Is Toff available for freelance?"],
};

const SECTION_CONTEXT = {
  about:          "The visitor is currently viewing the About section. Prioritize answers about Toff's background, personality, age, location, education, and stats.",
  tech:           "The visitor is currently viewing the Tech Stack section. Prioritize answers about Toff's programming languages, frameworks, tools, and technical skills.",
  certifications: "The visitor is currently viewing the Certifications section. Prioritize answers about Toff's Cisco certificates and credentials.",
  projects:       "The visitor is currently viewing the Projects section. Prioritize answers about Toff's projects — their tech stacks, descriptions, and GitHub links.",
  uiux:           "The visitor is currently viewing the UI/UX Showcase section. Prioritize answers about Toff's design skills, Figma work, and front-end capabilities.",
  services:       "The visitor is currently viewing the Services section. Prioritize answers about what Toff can build for clients — SaaS, web apps, dashboards, capstone systems.",
  timeline:       "The visitor is currently viewing the Journey/Timeline section. Prioritize answers about Toff's learning history and career progression.",
  contact:        "The visitor is currently viewing the Contact section. Encourage them to reach out and provide Toff's contact info.",
};

const SECTION_LABELS = {
  hero:           'Home',
  about:          'About',
  tech:           'Tech Stack',
  certifications: 'Certifications',
  projects:       'Projects',
  uiux:           'UI/UX',
  services:       'Services',
  timeline:       'Journey',
  contact:        'Contact',
};

const buildSystemPrompt = (activeSection) => {
  const ctx = SECTION_CONTEXT[activeSection];
  if (!ctx) return SYSTEM_PROMPT;
  return `${SYSTEM_PROMPT}\n\n=== CURRENT PAGE CONTEXT ===\n${ctx}`;
};

// ─── Groq API Call ────────────────────────────────────────────────────────────
async function callGroq(messages, onChunk, activeSection = 'hero') {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: buildSystemPrompt(activeSection) }, ...messages],
      stream: true,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onChunk(delta);
        } catch {
          // ignore parse errors on stream
        }
      }
    }
  }
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2.5 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
            : 'linear-gradient(135deg, #1e1e2e, #2d2d44)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {isUser
          ? <User className="w-3.5 h-3.5 text-white" />
          : <Bot className="w-3.5 h-3.5 text-purple-400" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
          isUser
            ? 'rounded-br-sm text-white'
            : 'rounded-bl-sm text-zinc-100'
        }`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
            : 'rgba(255,255,255,0.06)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          boxShadow: isUser
            ? '0 4px 20px rgba(124,58,237,0.3)'
            : '0 2px 10px rgba(0,0,0,0.3)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.content}
        {msg.streaming && (
          <span className="inline-block ml-1">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-purple-400 font-bold"
            >▋</motion.span>
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex gap-2.5 items-end">
    <div
      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #1e1e2e, #2d2d44)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Bot className="w-3.5 h-3.5 text-purple-400" />
    </div>
    <div
      className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-purple-400"
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity, delay }}
        />
      ))}
    </div>
  </div>
);

// Helper to get 2 unique random suggestions from the section pool
const getRandomSuggestions = (section) => {
  const pool = SECTION_SUGGESTIONS[section] || DEFAULT_SUGGESTIONS;
  if (!pool || pool.length === 0) return [];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

// ─── Main ChatBot Component ───────────────────────────────────────────────────
const ChatBot = ({ activeSection = 'hero' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [floatingSuggestions, setFloatingSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const handleContactClick = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    setTimeout(() => {
      window.open('https://m.me/toffdarell', '_blank', 'noopener,noreferrer');
      setIsRedirecting(false);
    }, 600);
  };

  // Scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Show scroll-to-bottom button
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!isNearBottom);
  };

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    // Add empty assistant message for streaming
    const assistantMsgId = Date.now();
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: assistantMsgId }]);

    try {
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
      let fullContent = '';

      await callGroq(history, (chunk) => {
        fullContent += chunk;
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId
              ? { ...m, content: fullContent }
              : m
          )
        );
      }, activeSection);

      // Finalize (remove streaming flag)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, streaming: false }
            : m
        )
      );

      // Generate new random floating suggestions
      const randomSugs = getRandomSuggestions(activeSection);
      setFloatingSuggestions(randomSugs);
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: "Sorry, I couldn't connect to the AI. Please try again!", streaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Floating Button ── */}
      <motion.button
        id="chatbot-toggle"
        aria-label="Open AI chat assistant"
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 12px 40px rgba(124,58,237,0.7)' }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? {} : {
          boxShadow: [
            '0 8px 32px rgba(124,58,237,0.5)',
            '0 8px 48px rgba(124,58,237,0.8)',
            '0 8px 32px rgba(124,58,237,0.5)',
          ],
        }}
        transition={{ duration: 2.5, repeat: isOpen ? 0 : Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread dot when closed */}
        {!isOpen && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              height: '520px',
              background: 'rgba(10, 10, 20, 0.92)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)',
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                >
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a14]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Toff's AI Assistant</p>
                {SECTION_LABELS[activeSection] && activeSection !== 'hero' && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeSection}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                      Viewing {SECTION_LABELS[activeSection]}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer p-1"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.3) transparent' }}
            >
              {/* Welcome state */}
              {isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}
                  >
                    <Bot className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">Hey! I'm Toff's AI</p>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-5 px-4">
                    Ask me anything about Toff — his projects, skills, experience, or how to get in touch!
                  </p>

                  {/* Suggested questions — section-aware */}
                  <div className="grid grid-cols-2 gap-2">
                    {(SECTION_SUGGESTIONS[activeSection] || DEFAULT_SUGGESTIONS).map((s, i) => (
                      <motion.button
                        key={`${activeSection}-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-2 rounded-xl text-left text-zinc-300 cursor-pointer transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>

                  {/* ── Contact Toff CTA ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-3"
                  >
                    <motion.button
                      id="chatbot-contact"
                      onClick={handleContactClick}
                      disabled={isRedirecting}
                      whileHover={!isRedirecting ? { scale: 1.02, y: -1 } : {}}
                      whileTap={!isRedirecting ? { scale: 0.98 } : {}}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all relative overflow-hidden"
                      style={{
                        background: isRedirecting
                          ? 'rgba(124,58,237,0.4)'
                          : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        boxShadow: isRedirecting ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
                      }}
                      aria-label="Open Messenger to contact Toff"
                    >
                      {isRedirecting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                          />
                          <span className="text-white/80">Opening Messenger...</span>
                        </>
                      ) : (
                        <>
                          <span>💬</span>
                          <span>Contact Toff</span>
                        </>
                      )}
                    </motion.button>
                    <p className="text-zinc-500 text-[10px] text-center mt-1.5 leading-relaxed">
                      Discuss projects, internships, collaborations, or freelance work.
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id || i} msg={msg} />
              ))}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <TypingIndicator />
              )}

              {/* Floating inline suggestions after the last message */}
              {!isEmpty && !isLoading && messages[messages.length - 1]?.role === 'assistant' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 justify-start mt-2 pl-9 pr-4"
                >
                  {/* Always include Live Chat */}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContactClick}
                    className="text-xs px-3 py-1.5 rounded-full text-zinc-300 cursor-pointer transition-all flex items-center gap-1"
                    style={{
                      background: 'rgba(124, 58, 237, 0.15)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                    }}
                  >
                    <span>💬</span>
                    <span>Chat Live</span>
                  </motion.button>

                  {/* The 2 random suggestions */}
                  {floatingSuggestions.map((s, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full text-zinc-300 cursor-pointer transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-10"
                  style={{ background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)' }}
                >
                  <ChevronDown className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Input Bar ── */}
            <div
              className="flex-shrink-0 px-3 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <textarea
                  ref={inputRef}
                  id="chatbot-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Toff..."
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none outline-none leading-relaxed py-0.5"
                  style={{ maxHeight: '80px', overflowY: 'auto' }}
                />
                <motion.button
                  id="chatbot-send"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  whileHover={input.trim() && !isLoading ? { scale: 1.1 } : {}}
                  whileTap={input.trim() && !isLoading ? { scale: 0.9 } : {}}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    background: input.trim() && !isLoading
                      ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: input.trim() && !isLoading ? '0 4px 15px rgba(124,58,237,0.4)' : 'none',
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>
              <p className="text-center text-zinc-600 text-[10px] mt-2">
                AI may make mistakes · Toff's info as of 2025
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
