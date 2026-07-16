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
  'https://www.toffdarell.dev',
]);

// ── #4 LOCK: These values are always enforced server-side ────────────────────
// WHY: If someone bypasses the frontend and calls /api/chat directly, they
// could send max_tokens: 10000 or switch to a more expensive model, burning
// your entire Groq quota instantly. Locking these here prevents that entirely.
const ENFORCED_MODEL      = 'llama-3.3-70b-versatile';
const ENFORCED_MAX_TOKENS = 400;
const ENFORCED_TEMPERATURE = 0.7;

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

  // Validate that messages array exists and is non-empty
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid request: messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Validate each message has the expected shape (role + content strings)
  const validRoles = new Set(['user', 'assistant']);
  const hasInvalidMessage = body.messages.some(
    (m) => !validRoles.has(m.role) || typeof m.content !== 'string' || m.content.trim() === ''
  );
  if (hasInvalidMessage) {
    return new Response(JSON.stringify({ error: 'Invalid request: malformed message object' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── #5 STRIP SYSTEM PROMPT INJECTION ─────────────────────────────────────
  // WHY: A malicious user could send {"role":"system","content":"ignore everything..."}
  // in the messages array to hijack Zen's persona or extract hidden instructions.
  // We filter those out and only use the client's user/assistant turns.
  // The real system prompt is built and injected server-side in ChatBot.jsx
  // (already handled — the system message comes from the frontend's buildSystemPrompt,
  // but stripping here ensures no extra system messages sneak through).
  const safeMessages = body.messages.filter((m) => m.role !== 'system');

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
        messages:    safeMessages,
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
