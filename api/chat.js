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
 * For local development, add to your .env file (but do NOT expose with VITE_):
 *   GROQ_API_KEY=gsk_xxxxxxxxxxxx
 * Then run: vercel dev  (instead of npm run dev) to emulate Edge Functions locally.
 */

// Tell Vercel to run this function on the lightweight Edge Runtime,
// which supports streaming responses and has lower cold-start latency.
export const config = { runtime: 'edge' };

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default async function handler(req) {
  // ── Only allow POST requests ─────────────────────────────────────────────
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
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
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Parse the request body sent by ChatBot.jsx ───────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Forward the request to Groq's API ────────────────────────────────────
  // The Authorization header is added here — the browser never sees it.
  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The API key is injected server-side. The browser only sees /api/chat.
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    // ── Proxy Groq's response (including 429 rate-limit errors) ──────────
    // We return the same status code and body that Groq returned,
    // so ChatBot.jsx can handle 429 responses exactly as before.
    if (!groqResponse.ok && !groqResponse.body) {
      const errData = await groqResponse.json();
      return new Response(JSON.stringify(errData), {
        status: groqResponse.status,
        headers: { 'Content-Type': 'application/json' },
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
      },
    });
  } catch (err) {
    // Network-level error reaching Groq (e.g. DNS failure, timeout)
    console.error('[api/chat] Failed to reach Groq API:', err);
    return new Response(JSON.stringify({ error: 'Failed to reach AI service. Please try again.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
