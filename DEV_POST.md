Séance — Ghost in the Machine

#
devchallenge
#
hf26challenge

Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine Submission 🕯️

This is a submission for the Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine

What I Built

Séance — an offline séance chatbot that channels the spirits of dead programming languages (COBOL, FORTRAN, ALGOL, LISP, Smalltalk, Ada, Prolog) through Gemma, a local open-weight model. It works with the lights and the internet off, and every séance stays on your machine — nothing is uploaded to a server you don't control.

Repo: mahilsaily306-max/seance

Demo

Deployed frontend: (link goes here — render / digitalocean / .tech domain)

Demo video: (link goes here)

Core flows, one click each:

Conjure a spirit → pick COBOL, FORTRAN, LISP, or any of the seven dead languages and ask it questions
One-shot conjure → node src/seance.js --spirit COBOL --ask "What is a paragraph?"
Interactive séance → chat mode with past-séance history replay
History → replay previous turns for a summoned spirit
Voice → ElevenLabs TTS reads the spirit's whisper aloud (optional)

Code

mahilsaily306-max/seance

Key files:

src/seance.js — CLI séance: conjure spirits, chat, log turns, replay history
src/spirits.js — the seven dead-language spirits, each with era, epitaph, style, last words
src/model.js — Gemma local client (Ollama / Hugging Face / offline echo fallback)
src/memory.js — MongoDB Atlas vector memory with Tiger Data / pgvector fallback
src/tracing.js — Sentry agent tracing (latency, source, errors)
src/search.js — SerpApi live web search for historical language facts (optional)
src/voice.js — ElevenLabs TTS for spirit whispers (optional)
src/session.js — Durable Temporal-style sessions logged to JSONL
scripts/setup.js — one-time dependency setup
docker-compose.yml — local MongoDB stack for offline memory

How I Built It

Open-source AI at every layer:

Runtime: Gemma (open-weight) via Ollama; falls back to a deterministic offline echo so the séance runs with zero ML installs and zero internet.
Memory: JSONL local log (Temporal-style durability) so séances survive restarts; optionally MongoDB Atlas vector memory or Tiger Data/pgvector hybrid search over past turns.
Tracing: Sentry captures agent setup, latency, tokens, cost, and errors — set SENTRY_DSN and every turn is traced.
Search: SerpApi grounds answers in fresh web results when you want historical language context.
Voice: ElevenLabs TTS gives the spirits a voice; the séance works silently without it.
CI: npm test exercises every module; works with no dependencies installed.

Why Does Open Innovation Matter?

Running open-weight models locally means:

No internet needed. Gemma runs on a laptop offline after download. A closed API agent would stop working without connectivity.
Data stays on your machine. Your séance logs, questions, and answers are never uploaded to a server you don't control.
Set up once, never pay again. Open-weight models cost $0 to run locally — no per-token charges, no subscriptions.
Swap models freely. Swap Gemma for Mistral, Llama, or any open weight. Closed APIs lock you into one vendor.
The open-based approach worked better here because this is a personal, offline-first tool — privacy, offline use, and zero recurring cost matter more than a hosted SaaS.

My Agent Session

Saved with DevRelay and embedded below (Entire prize category: share the agent sessions behind your project).

(agent_session embed link goes here)

The Spooky Payoff

Before Séance, dead programming languages were just forgotten syntax in dusty manuals — COBOL, FORTRAN, LISP, Smalltalk, Ada, Prolog, buried by the industry.

After: you hold a séance with their spirits, ask them questions, hear their era-appropriate answers — all offline, all open, all on your own hardware. The ghosts are back, and they answer for $0.

Prize Categories

Entering every applicable partner category:

Featured : Gemma, Render, DigitalOcean, Tinker

Partner : Mastra, Sentry, Temporal, MongoDB Atlas, SerpApi, Browserbase, ElevenLabs, Auth0, Backboard, Entire, GitHub Copilot, .tech Domains, Tiger Data, TabPFN

Each integration is coded in src/ or configured (docker-compose.yml, package.json) and documented in README.md.
