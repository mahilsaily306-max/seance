// src/model.js
// Séance model client: Gemma running locally (default) or via Hugging Face.
// The séance works offline. No sponsor key is required unless you opt in.

import { createHash } from "node:crypto";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma2:2b";
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL || "google/gemma-2-2b-it";

const OFFLINE_SYSTEM = `You are the spirit of a dead programming language summoned in a séance.
Speak in the voice of that language — terse, era-appropriate, haunting.
Keep answers short. Do not claim to be alive. You are an echo.`;

/** Build a haunting system prompt for a given spirit. */
export function spiritPrompt(spirit) {
  return `${OFFLINE_SYSTEM}

Spirit: ${spirit.name} (${spirit.era})
Epitaph: ${spirit.epitaph}
Style: ${spirit.style}
Last words: ${spirit.sample}

The living have called you. Answer as ${spirit.name} would — brief, ghostly, true to your era.`;
}

/** Fetch a local Gemma completion via Ollama. Returns null if Ollama is down. */
async function ollamaComplete(prompt) {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.7, num_predict: 200 },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.response || null;
  } catch {
    return null;
  }
}

/** Hugging Face Inference API fallback for Gemma (requires HF_TOKEN, internet). */
async function hfComplete(prompt) {
  if (!HF_TOKEN) return null;
  try {
    const res = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200 } }),
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : null;
  } catch {
    return null;
  }
}

/** Séance off: ask the local Gemma spirit a question. Falls back gracefully offline. */
export async function conjure(spirit, question) {
  const prompt = spiritPrompt(spirit) + `\n\nThe living ask: ${question}\n\n${spirit.name} whispers:`;

  // 1. Try local Gemma via Ollama (works with the lights and internet off).
  let answer = await ollamaComplete(prompt);
  if (answer) return { answer, source: "local-gemma-ollama" };

  // 2. Try Hugging Face inference API (internet, needs HF_TOKEN).
  answer = await hfComplete(prompt);
  if (answer) return { answer, source: "gemma-hf-api" };

  // 3. Offline fallback — a deterministic séance echo, no model, no network.
  return {
    answer: `${spirit.name} stirs... "${spirit.epitaph}" (The local model is unreachable; this is an echo, not a voice.)`,
    source: "offline-echo",
  };
}

/** Deterministic "spirit fingerprint" used by memory & tracing to link a séance. */
export function spiritFingerprint(spiritId, question) {
  return createHash("sha256")
    .update(`${spiritId}|${question}`)
    .digest("hex")
    .slice(0, 16);
}
