# Séance — Ghost in the Machine

> An offline séance chatbot that channels the spirits of dead programming
> languages (COBOL, FORTRAN, ALGOL, LISP, Smalltalk, Ada, Prolog) through a
> local open-weight model (Gemma). Works with the lights and the internet off.
> All your séances stay on your machine.

Built for **Hacktoberfest 2026 — Challenge Week 4: Ghost in the Machine**.

Tags: `#devchallenge #hf26challenge`

## What it is

Séance is a terminal chatbot. You conjure the spirit of a dead programming
language and ask it questions. It answers in that language's voice — terse,
era-appropriate, haunting. The core model is **Gemma**, Google's open-weight
model, run locally (via Ollama) so nothing leaves your computer.

```
╔═══════════════════════════════════════════════════════════════╗
║  🕯️  SÉANCE — COBOL                                          ║
║  Era: 1959                                                   ║
║  Epitaph: "MOVE CORRESPONDING — and then silence."           ║
║  ...                                                         ║
║  The spirit of COBOL has been summoned. Ask it anything.     ║
╚═══════════════════════════════════════════════════════════════╝
> What is a paragraph?
COBOL whispers: ...
```

## Theme: Ghost in the Machine

The prompt asked for something spooky, or something honoring the past, built
with open-weight models or open-source AI. Séance does both: it resurrects
the voices of languages the industry buried, and it runs entirely on
open-source pieces you control.

- **Spooky**: you're literally holding a séance with dead software.
- **Honoring the past**: each spirit carries its era, epitaph, and last words.
- **Open-source AI at its core**: Gemma (open-weight) is the default model;
  swap in any open-weight model you like.

## Why open innovation matters here

| Closed approach | Séance (open) |
|---|---|
| Model hosted on a vendor's server; your chats leave your machine | Gemma runs **locally** via Ollama; works offline |
| You're locked into one model/provider | Swap models freely — Ollama, HF API, or a local echo |
| Costs per-token, forever | **Costs nothing** to run locally |
| Service can disappear or change terms | Code and weights are yours; runs on a laptop |

Your family's stories, your séance logs, your data — they stay on **your**
machine, not a server you don't control.

## Quick start

```bash
# 1. Install Ollama (https://ollama.com) and pull Gemma
ollama pull gemma2:2b
ollama serve

# 2. Run the séance
git clone https://github.com/mahilsaily306-max/seance.git
cd seance
npm install
npm start

# List spirits
npm start -- --list

# One-shot conjure
npm start -- --spirit COBOL --ask "What is a paragraph?"
```

No sponsor keys required. With no Ollama running, Séance falls back to a
deterministic offline echo — the séance never crashes, even completely
offline.

## Sponsor integrations (opt-in)

Séance is designed so **every sponsor integration is optional**. Copy
`.env.example` to `.env` and fill in only the ones you want. The séance works
without any of them.

| Sponsor | What it powers | Env var |
|---|---|---|
| **Gemma** (Google) | Open-weight model at the séance's core | `OLLAMA_MODEL` |
| **Mastra** | Agent orchestration, memory, tools | `MASTRA_API_KEY` |
| **MongoDB Atlas** | Vector memory for séance history | `MONGODB_URI` |
| **Tiger Data / pgvector** | Hybrid keyword + vector search | `TIGER_DATABASE_URL` |
| **Sentry** | Agent tracing, latency, cost, debugging | `SENTRY_DSN` |
| **SerpApi** | Live web search for historical language facts | `SERPAPI_KEY` |
| **ElevenLabs** | Voice for the whispers (TTS) | `ELEVENLABS_API_KEY` |
| **Temporal** | Durable séance sessions (retries / resumes) | `TEMPORAL_ADDRESS` |
| **Auth0** | Sign-in & tool approval for séances | `AUTH0_DOMAIN` |
| **Browserbase** | Real browser for agent tasks | `BROWSERBASE_API_KEY` |
| **Backboard** | Terminal coding agent / model comparison | `BACKBOARD_API_KEY` |
| **Tinker** (Thinking Machines) | Fine-tune Gemma for the séance | `TINKER_API_KEY` |
| **TabPFN** (Prior Labs) | Tabular predictions over language features | `TABPFN_API_KEY` |
| **Render** | Host the séance front end / agent runtime | — |
| **DigitalOcean** | GPU Droplet (1-Click Models) for Gemma | — |
| **.tech Domains** | Claim `seance.tech` for the project site | — |
| **Qualcomm / Arduino** | Run a model on Arduino UNO Q (noted, hardware) | — |
| **Entire** | Share agent sessions in the write-up | — |
| **GitHub Copilot** | Used to build this project | — |

Example `.env`:

```bash
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma2:2b
SENTRY_DSN=https://...@sentry.io/...
MONGODB_URI=mongodb+srv://...
SERPAPI_KEY=...
ELEVENLABS_API_KEY=...
TEMPORAL_ADDRESS=localhost:7233
```

## Project structure

```
seance/
├── src/seance.js       # CLI séance — conjure spirits, chat, log turns
├── src/spirits.js      # The seven dead-language spirits
├── src/model.js        # Gemma local client (Ollama / HF / offline echo)
├── src/memory.js       # MongoDB Atlas + Tiger Data memory (lazy)
├── src/tracing.js      # Sentry agent tracing (lazy)
├── src/search.js       # SerpApi live web search (lazy)
├── src/voice.js        # ElevenLabs TTS (lazy)
├── src/session.js      # Durable Temporal-style sessions (JSONL log)
├── scripts/setup.js    # One-time dependency setup
├── docker-compose.yml  # Local MongoDB stack (offline memory)
├── .env.example        # All sponsor env vars (copy to .env)
├── DEPLOY.md           # Render / DigitalOcean / .tech hosting notes
└── README.md
```

## Local-first memory

Séance logs every turn to `./séance-logs/sessions.jsonl` so a séance survives
restarts (Temporal-style durability). Optionally, point `MONGODB_URI` at
MongoDB Atlas for vector memory, or `TIGER_DATABASE_URL` at Tiger Data/pgvector
for hybrid keyword + vector search over past séances.

## Observability

Set `SENTRY_DSN` and every séance turn is traced — latency, source, errors —
so you can debug the agent's work. Without it, tracing is silently skipped.

## Deployment (optional partners)

See `DEPLOY.md`.

- **Render**: host the séance or run Hermes/OpenClaw as the agent runtime.
- **DigitalOcean**: GPU Droplet (1-Click Models) to serve Gemma remotely.
- **.tech Domains**: claim `seance.tech` via hacktoberfest.com/my/promos.

## Hacktoberfest submission

This project is a new build with open-source AI (Gemma, open-weight) at its
core, honoring the past (dead programming languages) in the spirit of Día de
los Muertos. The open pieces are what make it work: local inference, local
storage, swappable models, zero cost, no vendor lock-in.

Submit a post on DEV with `#devchallenge #hf26challenge`, embed this repo, and
tell the story of the séance.

## License

MIT
