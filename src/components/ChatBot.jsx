import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, ChevronDown } from 'lucide-react';
import zenGif from '../assets/chatrprofile.gif';

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

// ─── Groq API Call (via Vercel Edge Function) ────────────────────────────────
//
// SECURITY: The Groq API key and the System Prompt have been moved to a Vercel
// Edge Function at /api/chat.js. The frontend now only sends user/assistant
// messages and the activeSection string. This completely protects the API key,
// prevents system prompt tampering, and reduces frontend bundle size.
//
// The Edge Function prepends the system prompt and pipes Groq's SSE stream back
// transparently, so all streaming and chunk parsing below work unchanged.
//
// onRateLimit(retryAfterSeconds) is called when the API returns 429.
async function callGroq(messages, onChunk, activeSection = 'hero', onRateLimit = null) {
  // /api/chat is our Vercel Edge Function — same origin, no API key in the browser.
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages,
      activeSection: activeSection,
    }),
  });

  if (response.status === 429) {
    let retryAfter = null;
    try {
      const errBody = await response.json();
      const errMsg = errBody?.error?.message || '';
      const match = errMsg.match(/try again in ([0-9a-zA-Z\.]+)/i);
      if (match && match[1]) {
        const timeStr = match[1];
        let seconds = 0;
        const hrMatch = timeStr.match(/(\d+(?:\.\d+)?)h/i);
        const minMatch = timeStr.match(/(\d+(?:\.\d+)?)m(?!s)/i);
        const secMatch = timeStr.match(/(\d+(?:\.\d+)?)s/i);
        
        if (hrMatch) seconds += parseFloat(hrMatch[1]) * 3600;
        if (minMatch) seconds += parseFloat(minMatch[1]) * 60;
        if (secMatch) seconds += parseFloat(secMatch[1]);
        
        if (seconds > 0) {
          retryAfter = seconds;
        }
      }
    } catch {
      // ignore JSON parse errors
    }

    if (retryAfter === null) {
      retryAfter = parseFloat(response.headers.get('retry-after') || '60');
    }

    if (onRateLimit) onRateLimit(retryAfter);
    const err = new Error('RATE_LIMITED');
    err.retryAfter = retryAfter;
    throw err;
  }

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
const MessageBubble = ({ msg, isDark = true }) => {
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
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg overflow-hidden`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
            : 'linear-gradient(135deg, #7c3aed, #2563eb)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: isUser ? '0 2px 10px rgba(124,58,237,0.4)' : '0 0 12px rgba(124,58,237,0.5)',
        }}
      >
        {isUser
          ? <User className="w-3.5 h-3.5 text-white" />
          : <img
              src={zenGif}
              alt="Zen"
              className="w-full h-full object-cover"
              style={{
                filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
                mixBlendMode: isDark ? 'screen' : 'multiply',
              }}
            />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[80%] px-3 py-2.5 sm:px-3.5 rounded-2xl text-sm leading-relaxed shadow-md ${
          isUser
            ? 'rounded-br-sm text-white'
            : `rounded-bl-sm ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`
        }`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
            : isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.9)',
          border: isUser ? 'none' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(12px)',
          boxShadow: isUser
            ? '0 4px 20px rgba(124,58,237,0.3)'
            : isDark
              ? '0 2px 10px rgba(0,0,0,0.3)'
              : '0 2px 10px rgba(0,0,0,0.08)',
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
const TypingIndicator = ({ isDark = true }) => (
  <div className="flex gap-2.5 items-end">
    <div
      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 0 12px rgba(124,58,237,0.5)',
      }}
    >
      <img
        src={zenGif}
        alt="Zen"
        className="w-full h-full object-cover"
        style={{
          filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />
    </div>
    <div
      className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
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
const ChatBot = ({ activeSection = 'hero', isDark = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [floatingSuggestions, setFloatingSuggestions] = useState([]);
  // Rate-limit cooldown: timestamp (ms) when the user can send again
  const [rateLimitUntil, setRateLimitUntil] = useState(null);
  const [cooldownSecs, setCooldownSecs] = useState(0);
  const cooldownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  // ── Rate-limit countdown ticker ──
  const startCooldown = (seconds) => {
    const until = Date.now() + seconds * 1000;
    setRateLimitUntil(until);
    setCooldownSecs(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      const remaining = Math.max(0, (until - Date.now()) / 1000);
      setCooldownSecs(remaining);
      if (remaining <= 0) {
        clearInterval(cooldownRef.current);
        setRateLimitUntil(null);
      }
    }, 100); // 100ms tick for smooth high-resolution updates
  };

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const isRateLimited = rateLimitUntil !== null && Date.now() < rateLimitUntil;

  const formatCooldown = (secs) => {
    if (secs <= 0) return '0.0s';
    if (secs < 10) {
      return `${secs.toFixed(1)}s`;
    }
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  const getResumeTime = () => {
    if (!rateLimitUntil) return '';
    return new Date(rateLimitUntil).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
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
    if (!userText || isLoading || isRateLimited) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    // Add empty assistant message for streaming
    const assistantMsgId = Date.now();
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: assistantMsgId }]);

    try {
      const history = newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      let fullContent = '';

      await callGroq(
        history,
        (chunk) => {
          fullContent += chunk;
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, content: fullContent } : m
            )
          );
        },
        activeSection,
        (retryAfter) => startCooldown(retryAfter),
      );

      // Finalize (remove streaming flag)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId ? { ...m, streaming: false } : m
        )
      );

      // Generate new random floating suggestions
      const randomSugs = getRandomSuggestions(activeSection);
      setFloatingSuggestions(randomSugs);
    } catch (err) {
      if (err.message === 'RATE_LIMITED') {
        // Remove the empty assistant placeholder
        setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId
              ? { ...m, content: "Sorry, I couldn't connect to the AI. Please try again!", streaming: false }
              : m
          )
        );
      }
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
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          boxShadow: isDark
            ? '0 8px 32px rgba(124,58,237,0.5), 0 0 20px rgba(168, 85, 247, 0.4)'
            : '0 8px 24px rgba(124,58,237,0.25)',
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
            <motion.div key="zen" className="w-full h-full p-0.5" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.2 }}>
              <img
                src={zenGif}
                alt="Zen"
                className="w-full h-full object-cover rounded-full"
                style={{
                  filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
                  mixBlendMode: isDark ? 'screen' : 'multiply',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread dot when closed */}
        {!isOpen && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{
              background: '#6366f1',
              borderColor: isDark ? '#0a0a0a' : '#ffffff',
              boxShadow: '0 0 10px #6366f1',
            }}
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
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl
              inset-x-3 bottom-20 h-[calc(100dvh-100px)]
              sm:inset-auto sm:bottom-20 sm:right-5 sm:w-[380px] sm:h-[520px]
              md:bottom-24 md:right-6 md:w-[400px] md:h-[540px]"
            style={{
              background: isDark ? 'rgba(10, 10, 20, 0.92)' : 'rgba(255, 255, 255, 0.95)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              backdropFilter: 'blur(24px)',
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)'
                : '0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(124,58,237,0.15)',
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 flex-shrink-0"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))'
                  : 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.05))',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    boxShadow: '0 0 12px rgba(124,58,237,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <img
                    src={zenGif}
                    alt="Zen"
                    className="w-full h-full object-cover"
                    style={{
                      filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
                      mixBlendMode: isDark ? 'screen' : 'multiply',
                    }}
                  />
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2"
                  style={{
                    background: '#6366f1',
                    borderColor: isDark ? '#0a0a14' : '#ffffff',
                    boxShadow: '0 0 8px #6366f1',
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-white' : 'text-zinc-800'}`}>Zen <span className="font-normal text-xs text-purple-400">· Toff's AI</span></p>
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
                className={`transition-colors cursor-pointer p-1 ${isDark ? 'text-zinc-500 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-700'}`}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 space-y-3 sm:space-y-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: isDark ? 'rgba(124,58,237,0.3) transparent' : 'rgba(124,58,237,0.2) transparent' }}
            >
              {/* Welcome state header (always visible at top of scroll list) */}
              <div className="text-center py-3 sm:py-4">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 0 24px rgba(124,58,237,0.6), 0 0 48px rgba(168,85,247,0.3)',
                  }}
                >
                  <img
                    src={zenGif}
                    alt="Zen"
                    className="w-full h-full object-cover"
                    style={{
                      filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
                      mixBlendMode: isDark ? 'screen' : 'multiply',
                    }}
                  />
                </motion.div>
                <p className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-zinc-800'}`}>Hey! I'm <span className="text-purple-400">Zen</span> 👋</p>
                <p className={`text-[11px] font-medium mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Toff's AI Companion</p>
                <p className={`text-xs leading-relaxed mb-4 sm:mb-5 px-2 sm:px-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Ask me anything about Toff — his projects, skills, experience, or how to get in touch!
                </p>

                {/* Suggested questions & Contact Button (Only visible if chat is empty) */}
                <AnimatePresence>
                  {isEmpty && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Suggested questions — section-aware */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(SECTION_SUGGESTIONS[activeSection] || DEFAULT_SUGGESTIONS).map((s, i) => (
                          <motion.button
                            key={`${activeSection}-${i}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => sendMessage(s)}
                            className={`text-xs px-3 py-2.5 sm:py-2 rounded-xl text-left cursor-pointer transition-all ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
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
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                          }}
                          aria-label="Open contact option modal"
                        >
                          <span>💬</span>
                          <span>Contact Toff</span>
                        </motion.button>
                        <p className={`text-[10px] text-center mt-1.5 leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          Discuss projects, internships, collaborations, or freelance work.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Messages */}
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id || i} msg={msg} isDark={isDark} />
              ))}

              {/* Typing indicator */}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <TypingIndicator isDark={isDark} />
              )}

              {/* Floating inline suggestions after the last message */}
              {!isEmpty && !isLoading && messages[messages.length - 1]?.role === 'assistant' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1.5 sm:gap-2 justify-start mt-2 pl-7 sm:pl-9 pr-3 sm:pr-4"
                >
                  {/* Always include Live Chat */}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContactClick}
                    className={`text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
                    style={{
                      background: isDark ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
                      border: isDark ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(124, 58, 237, 0.15)',
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
                      className={`text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
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
                  className="absolute bottom-20 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-10"
                  style={{ background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)' }}
                >
                  <ChevronDown className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Rate Limit Banner ── */}
            <AnimatePresence>
              {isRateLimited && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: [0, -8, 8, -6, 6, -4, 4, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="flex-shrink-0 mx-3 mb-1.5 px-3 py-2.5 rounded-xl flex items-center gap-2.5 shadow-lg"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.1))'
                      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(245, 158, 11, 0.05))',
                    border: isDark
                      ? '1px solid rgba(239, 68, 68, 0.35)'
                      : '1px solid rgba(239, 68, 68, 0.25)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Bouncing crying Zen */}
                  <motion.div
                    animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden select-none"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 0 12px rgba(124,58,237,0.5)',
                    }}
                  >
                    <img
                      src={zenGif}
                      alt="Zen sad"
                      className="w-full h-full object-cover"
                      style={{
                        filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
                        mixBlendMode: isDark ? 'screen' : 'multiply',
                      }}
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-red-400 leading-tight">Oh no! Zen hit the rate limit 😢</p>
                    <p className={`text-[10px] mt-0.5 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Please wait&nbsp;
                      <span className="font-bold text-red-300 bg-red-500/10 px-1 py-0.5 rounded">{formatCooldown(cooldownSecs)}</span>
                      &nbsp;(until&nbsp;
                      <span className="font-semibold text-orange-300">{getResumeTime()}</span>
                      ) before sending another message.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input Bar ── */}
            <div
              className="flex-shrink-0 px-2.5 py-2.5 sm:px-3 sm:py-3"
              style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-2.5 py-2 sm:px-3"
                style={{
                  background: isRateLimited
                    ? isDark ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.03)'
                    : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: isRateLimited
                    ? '1px solid rgba(239,68,68,0.2)'
                    : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                  transition: 'background 0.3s, border 0.3s',
                  opacity: isRateLimited ? 0.6 : 1,
                }}
              >
                <textarea
                  ref={inputRef}
                  id="chatbot-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isRateLimited ? `Wait ${formatCooldown(cooldownSecs)}…` : 'Ask about Toff...'}
                  rows={1}
                  disabled={isLoading || isRateLimited}
                  className={`flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed py-0.5 ${
                    isRateLimited
                      ? 'text-red-400/70 placeholder-red-400/50'
                      : isDark ? 'text-zinc-100 placeholder-zinc-500' : 'text-zinc-700 placeholder-zinc-400'
                  }`}
                  style={{ maxHeight: '80px', overflowY: 'auto' }}
                />
                <motion.button
                  id="chatbot-send"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading || isRateLimited}
                  whileHover={input.trim() && !isLoading && !isRateLimited ? { scale: 1.1 } : {}}
                  whileTap={input.trim() && !isLoading && !isRateLimited ? { scale: 0.9 } : {}}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    background: input.trim() && !isLoading && !isRateLimited
                      ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                      : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    boxShadow: input.trim() && !isLoading && !isRateLimited ? '0 4px 15px rgba(124,58,237,0.4)' : 'none',
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>
              <p className={`text-center text-[10px] mt-2 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                AI may make mistakes · Toff's info as of 2025
              </p>
            </div>

            {/* ── Contact Channel Selection Overlay ── */}
            <AnimatePresence>
              {showContactModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-[280px] p-5 rounded-2xl border flex flex-col gap-4 text-center glass relative overflow-hidden"
                    style={{
                      background: isDark ? 'rgba(10, 10, 20, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                      borderColor: isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.15)',
                      boxShadow: isDark 
                        ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15)'
                        : '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(124,58,237,0.1)',
                    }}
                  >
                    <div className="flex justify-between items-center pb-2" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>Contact Channels</h4>
                      <button
                        onClick={() => setShowContactModal(false)}
                        className={`p-1 rounded-lg cursor-pointer transition-colors ${isDark ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      How would you like to get in touch with Toff?
                    </p>

                    <div className="flex flex-col gap-2.5">
                      {/* Messenger button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          window.open('https://m.me/toffdarell', '_blank', 'noopener,noreferrer');
                          setShowContactModal(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all hover:bg-purple-500/10 hover:border-purple-500/30"
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <span className="text-xl">💬</span>
                        <div>
                          <p className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>Messenger</p>
                          <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Direct chat with Toff</p>
                        </div>
                      </motion.button>

                      {/* Gmail button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const subject = "Let's Connect / Project Inquiry";
                          const body = "Hi Toff,\n\nI'd love to connect! Here is what's on my mind:\n\n[Briefly describe your project, system idea, or query here...]\n\nLooking forward to hearing from you!";
                          const ua = navigator.userAgent;
                          const encodedTo = encodeURIComponent('topedarell13@gmail.com');
                          const encodedSu = encodeURIComponent(subject);
                          const encodedBody = encodeURIComponent(body);

                          if (/iPhone|iPad|iPod/i.test(ua)) {
                            // iOS — open Gmail app directly (no "Sent from my iPhone")
                            window.location.href = `googlegmail:///co?to=${encodedTo}&su=${encodedSu}&body=${encodedBody}`;
                          } else if (/Android/i.test(ua)) {
                            // Android — force Gmail app via intent URL
                            window.location.href = `intent://mail.google.com/mail/?view=cm&to=${encodedTo}&su=${encodedSu}&body=${encodedBody}#Intent;scheme=https;package=com.google.android.gm;end`;
                          } else {
                            // Desktop — open Gmail web
                            window.open(`https://mail.google.com/mail/?view=cm&to=${encodedTo}&su=${encodedSu}&body=${encodedBody}`, '_blank', 'noopener,noreferrer');
                          }
                          setShowContactModal(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all hover:bg-blue-500/10 hover:border-blue-500/30"
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <span className="text-xl">✉️</span>
                        <div>
                          <p className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>Gmail</p>
                          <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Send documents & details</p>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
