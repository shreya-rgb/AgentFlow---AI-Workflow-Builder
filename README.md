# AgentFlow — AI Workflow Builder

A visual drag-and-drop platform to build and run AI agent workflows in real-time. Connect agents together, hit Run, and watch AI execute each step live.

**[🚀 Live Demo](https://agent-flow-ai-workflow-builder.vercel.app/)**

---

## What it does

You drag agent nodes onto a canvas, connect them, and run the workflow. Each node does something — search the web, write content, summarize, generate code — and passes its output to the next node. The execution log shows every step in real-time as it happens.

```
Text Input → Web Searcher → Summarizer → Output
"AI in 2026"   5 results     Key points   Display
```

---

## Agent types

| Agent | What it does |
|---|---|
| 🔤 Text Input | Starting point — your topic or text |
| 🔍 Web Searcher | Searches the web via DuckDuckGo (free, no key needed) |
| ✍️ Writer | Writes content using GPT |
| 📝 Summarizer | Condenses long text into key points |
| 💻 Code Generator | Generates code in any language |
| 🔄 Transformer | Translates, reformats, or rewrites text |
| 📤 Output | Displays the final result |

---

## Built-in templates

- **Research Assistant** — Input → Web Search → Summarize → Output
- **Content Creator** — Input → Research → Write → Translate → Output
- **Code Review Chain** — Requirements → Generate Code → Review → Summary → Output

---

## Running locally

### Backend
```bash
cd agent-flow-builder/backend
pip install -r requirements.txt
cp .env.example .env
# Add your OpenAI API key to .env
python main.py
```
Runs at `http://localhost:8000`

> No API key? Set `MOCK_MODE=true` in `.env` for simulated responses.

### Frontend
```bash
cd agent-flow-builder/frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
npm run dev
```
Runs at `http://localhost:3000`

---

## Deploying

### Backend → Render (free)
1. New Web Service → connect GitHub repo
2. Root directory: `agent-flow-builder/backend`
3. Runtime: `Python 3`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Instance type: `Free`
7. Add env vars: `OPENAI_API_KEY`, `MOCK_MODE=false`

### Frontend → Vercel
1. Import repo → Root directory: `agent-flow-builder/frontend`
2. Add env var: `NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app`

---

## Tech stack

- **Frontend** — Next.js 14, React Flow, Zustand
- **Backend** — Python FastAPI, Server-Sent Events
- **AI** — OpenAI GPT-4o / GPT-4o-mini
- **Search** — DuckDuckGo (free)
- **Database** — SQLite

---

## Project structure

```
agent-flow-builder/
├── frontend/
│   └── src/
│       ├── app/              # Next.js pages
│       ├── components/       # Canvas, Sidebar, ConfigPanel, etc.
│       ├── store/            # Zustand state
│       └── utils/            # API helpers
└── backend/
    ├── main.py               # FastAPI routes
    ├── engine.py             # Workflow execution engine
    ├── agents.py             # Agent definitions
    ├── tools.py              # Web search
    ├── models.py             # Pydantic models
    └── database.py           # SQLite helpers
```
