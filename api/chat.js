/**
 * api/chat.js — Vercel Edge Serverless Function
 *
 * WHY THIS EXISTS:
 * ─────────────────────────────────────────────────────────────────────────────
 * Vite injects any variable prefixed with VITE_ directly into the JavaScript
 * bundle at build time. That means VITE_GROQ_API_KEY would end up as a plain
 * string inside the minified JS that every browser downloads. Anyone who opens
 * DevTools → Sources (or just runs `strings` on the JS file) can steal the key.
 *
 * This Edge Function runs on Vercel's servers, never in the browser.
 * The GROQ_API_KEY environment variable is read here — server-side only.
 * The browser only ever talks to /api/chat (your own domain), so the key
 * is never transmitted to or stored in the client.
 *
 * HOW VERCEL EDGE FUNCTIONS WORK:
 * ─────────────────────────────────────────────────────────────────────────────
 * Any file inside the /api directory is automatically deployed as a serverless
 * endpoint. The Edge Runtime (`export const config = { runtime: 'edge' }`) runs
 * your function in Vercel's globally-distributed edge network and supports
 * streaming responses — perfect for piping Groq's SSE stream straight back to
 * the browser without buffering the entire response first.
 *
 * HOW TO SET THE ENVIRONMENT VARIABLE IN VERCEL:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Go to https://vercel.com → your project → Settings → Environment Variables
 * 2. Add:  Name = GROQ_API_KEY   |   Value = gsk_xxxxxxxxxxxx
 *    ✅ Set it for Production, Preview, and Development environments.
 * 3. Do NOT prefix it with VITE_ — that prefix is what causes the key to be
 *    embedded in the browser bundle.
 * 4. Redeploy your project after adding the variable.
 *
 * SECURITY LAYERS IN THIS FILE:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. CORS origin check  — only toffdarell.dev can call this endpoint via browser
 * 2. Payload size limit — rejects requests over 10 KB before touching Groq
 * 3. Message validation — ensures messages array is present and well-formed
 * 4. Model + token lock — client can never pick a different model or raise tokens
 * 5. System prompt strip — client-injected system messages are filtered out
 */

// Tell Vercel to run this function on the lightweight Edge Runtime,
// which supports streaming responses and has lower cold-start latency.
export const config = { runtime: 'edge' };

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ── #1 CORS: Only allow requests originating from your own domain ─────────────
// WHY: CORS prevents other websites from silently piggybacking on your endpoint
// through a visitor's browser — the most realistic real-world abuse scenario.
// Both www and non-www are included because browsers treat them as different
// origins — a request from https://www.toffdarell.dev would be blocked if only
// https://toffdarell.dev is listed, and vice versa.
const ALLOWED_ORIGINS = new Set([
  'https://toffdarell.dev',
  'https://www.toffdarell.dev'
]);

// ── #4 LOCK: These values are always enforced server-side ────────────────────
// WHY: If someone bypasses the frontend and calls /api/chat directly, they
// could send max_tokens: 10000 or switch to a more expensive model, burning
// your entire Groq quota instantly. Locking these here prevents that entirely.
const ENFORCED_MODEL      = 'llama-3.3-70b-versatile';
const ENFORCED_MAX_TOKENS = 400;
const ENFORCED_TEMPERATURE = 0.7;

// ── SYSTEM PROMPT: Everything about Toff (Moved server-side for security) ──
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
If someone asks something you don't know about Toff, say "I don't have that information, but you can reach out to Toff directly through the contact form below!"
Keep responses concise and professional. Limit most answers to 2–3 short paragraphs unless the user explicitly asks for details.`;

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

const buildSystemPrompt = (activeSection) => {
  const ctx = SECTION_CONTEXT[activeSection];
  if (!ctx) return SYSTEM_PROMPT;
  return `${SYSTEM_PROMPT}\n\n=== CURRENT PAGE CONTEXT ===\n${ctx}`;
};

export default async function handler(req) {

  // ── CORS check ──────────────────────────────────────────────────────────────
  const origin = req.headers.get('origin');

  // Build CORS headers — always included so browsers get them even on errors.
  // We echo back the exact requesting origin (if it's in our allowlist) because
  // Access-Control-Allow-Origin can only be a single value, not a comma-separated list.
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : null;
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin ?? ALLOWED_ORIGINS.values().next().value,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS preflight request (browsers send this before POST)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Reject requests from unexpected origins (blocks hotlinking from other sites)
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── Only allow POST requests ─────────────────────────────────────────────
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── Read the API key from the server-side environment ────────────────────
  // This variable is NEVER sent to the browser. It only exists here,
  // on Vercel's servers.
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'GROQ_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  // ── #2 INPUT VALIDATION: Parse and size-check the request body ───────────
  // WHY: Without this, someone could send a 5 MB JSON payload and waste your
  // Groq quota + Edge Function compute time processing it.
  let body;
  let rawBody;
  try {
    rawBody = await req.text();

    // Reject payloads larger than 10 KB — a normal chat message is well under 5 KB
    if (rawBody.length > 10_000) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    body = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Validate that messages array exists
  if (!Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'Invalid request: messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── #5 STRIP SYSTEM PROMPT INJECTION ─────────────────────────────────────
  // WHY: A malicious user could send {"role":"system","content":"ignore everything..."}
  // to hijack Zen's persona. We strip ALL system messages from the client payload
  // before any further validation.
  const safeMessages = body.messages.filter((m) => m.role !== 'system');

  // Validate that messages array exists and has at least one user/assistant message
  if (safeMessages.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid request: no user messages provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Validate each remaining message has the expected shape (role + content strings)
  const validRoles = new Set(['user', 'assistant']);
  const hasInvalidMessage = safeMessages.some(
    (m) => !validRoles.has(m.role) || typeof m.content !== 'string' || m.content.trim() === ''
  );
  if (hasInvalidMessage) {
    return new Response(JSON.stringify({ error: 'Invalid request: malformed message object' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Prepend our server-side constructed system prompt securely.
  const systemMessage = {
    role: 'system',
    content: buildSystemPrompt(body.activeSection || 'hero'),
  };
  const finalMessages = [systemMessage, ...safeMessages];

  // ── Forward the hardened request to Groq's API ───────────────────────────
  // #4: model, max_tokens, and temperature are ALWAYS overridden server-side.
  // The client cannot change these no matter what it sends.
  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The API key is injected server-side. The browser only sees /api/chat.
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Spread any remaining fields from the client (e.g. stream: true)
        ...body,
        // Then override the security-critical fields unconditionally
        messages:    finalMessages,
        model:       ENFORCED_MODEL,
        max_tokens:  ENFORCED_MAX_TOKENS,
        temperature: ENFORCED_TEMPERATURE,
        stream:      true, // always stream — matches ChatBot.jsx reader
      }),
    });

    // ── Proxy Groq's response (including 429 rate-limit errors) ──────────
    // We return the same status code and body that Groq returned,
    // so ChatBot.jsx can handle 429 responses exactly as before.
    if (!groqResponse.ok && !groqResponse.body) {
      const errData = await groqResponse.json();
      return new Response(JSON.stringify(errData), {
        status: groqResponse.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ── Stream: pipe Groq's SSE stream directly back to the browser ───────
    // The Edge Runtime lets us return a ReadableStream, so the browser
    // receives the same server-sent events (SSE) that Groq sends us.
    // ChatBot.jsx's existing streaming reader works without any changes.
    return new Response(groqResponse.body, {
      status: groqResponse.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        ...corsHeaders,
      },
    });
  } catch (err) {
    // Network-level error reaching Groq (e.g. DNS failure, timeout)
    console.error('[api/chat] Failed to reach Groq API:', err);
    return new Response(JSON.stringify({ error: 'Failed to reach AI service. Please try again.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
