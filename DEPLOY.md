# Deploying Séance — Ghost in the Machine

Séance is designed to run **offline on your laptop** with a local open-weight
model (Gemma via Ollama). It also deploys to the cloud when you want it online.

## Run locally (offline, open-weight)

1. Install Ollama: https://ollama.com
2. Pull Gemma: `ollama pull gemma2:2b`
3. Start Ollama: `ollama serve`
4. `npm install && npm start`

No sponsor keys are required. The séance works with the lights and internet off,
and all data stays on your machine.

## Sponsor integrations (opt-in)

| Sponsor | What it powers | Env var |
|---|---|---|
| **Gemma** | Local open-weight model at the séance's core | `OLLAMA_MODEL` |
| **Mastra** | Agent orchestration, memory, tools | `MASTRA_API_KEY` |
| **MongoDB Atlas** | Vector memory for séance history | `MONGODB_URI` |
| **Tiger Data / pgvector** | Hybrid keyword + vector search | `TIGER_DATABASE_URL` |
| **Sentry** | Agent tracing, latency, cost, debugging | `SENTRY_DSN` |
| **SerpApi** | Live web search for historical facts | `SERPAPI_KEY` |
| **ElevenLabs** | Voice for the whispers | `ELEVENLABS_API_KEY` |
| **Temporal** | Durable séance sessions (retries/resumes) | `TEMPORAL_ADDRESS` |
| **Auth0** | Sign-in & tool approval for séances | `AUTH0_DOMAIN` |
| **Browserbase** | Real browser for agent tasks | `BROWSERBASE_API_KEY` |
| **Backboard** | Terminal coding agent / model comparison | `BACKBOARD_API_KEY` |
| **Tinker** | Fine-tune Gemma for the séance | `TINKER_API_KEY` |
| **TabPFN** | Tabular predictions over language features | `TABPFN_API_KEY` |

Copy `.env.example` to `.env` and fill in the sponsors you want to use.

## Cloud hosting (optional partners)

- **Render**: `render.com` — host the séance front end or run Hermes/OpenClaw.
- **DigitalOcean**: GPU Droplet (1-Click Models) to run Gemma remotely.
- **.tech Domains**: claim `seance.tech` via hacktoberfest.com/my/promos.

## Hacktoberfest 2026 — Challenge Week 4

Theme: "Ghost in the Machine" — build something spooky / honoring the past
with open-weight models or open-source AI.

Séance channels the spirits of dead programming languages (COBOL, FORTRAN,
ALGOL, LISP, Smalltalk, Ada, Prolog) through a local Gemma model. Open
innovation matters here because the séance runs on your laptop with no
internet, keeps your chats on your machine, lets you swap models, and costs
nothing to run.

Tags: #devchallenge #hf26challenge
