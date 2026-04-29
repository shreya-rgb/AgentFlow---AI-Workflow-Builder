# 🤖 AgentFlow — AI Workflow Builder

<div align="center">

![AgentFlow Banner](https://img.shields.io/badge/AgentFlow-AI%20Workflow%20Builder-6c63ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==)

**A visual drag-and-drop platform to build and run AI agent workflows in real-time.**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-6c63ff?style=for-the-badge)](https://agentflow-ai-workflow-builder.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡%20Backend%20API-Railway-0B0D0E?style=for-the-badge)](https://agentflow-backend.up.railway.app)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![React Flow](https://img.shields.io/badge/React%20Flow-11-ff0072?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## ✨ What is AgentFlow?

AgentFlow lets you visually connect AI agents together, hit **Run**, and watch them execute in real-time. No code needed — just drag, connect, and go.

```
Text Input → Web Searcher → Summarizer → Output
     ↓              ↓             ↓          ↓
  "AI 2026"    5 web results   Key points  Display
```

---

## 🎬 Demo

> **[🚀 Try the live demo →](https://agentflow-ai-workflow-builder.vercel.app)**

### Built-in Templates
| Template | Pipeline |
|---|---|
| 🔬 Research Assistant | Input → Web Search → Summarize → Output |
| ✍️ Content Creator | Input → Research → Write → Translate → Output |
| 💻 Code Review Chain | Requirements → Generate Code → Review → Summary → Output |

---

## 🧩 Agent Types

| Agent | Icon | What It Does |
|---|---|---|
| Text Input | 🔤 | Starting point — provide your topic or text |
| Web Searcher | 🔍 | Searches the web via DuckDuckGo (free, no key needed) |
| Writer | ✍️ | Writes content using GPT |
| Summarizer | 📝 | Condenses long text into key points |
| Code Generator | 💻 | Generates code in any language |
| Transformer | 🔄 | Translates, reformats, or rewrites text |
| Output | 📤 | Displays the final result |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js 14)          │
│  ┌──────────┐ ┌────────┐ ┌───────────┐  │
│  │ Canvas   │ │Sidebar │ │Config     │  │
│  │(ReactFlow│ │(Agents)│ │Panel      │  │
│  └──────────┘ └────────┘ └───────────┘  │
│  ┌─────────────────────────────────────┐ │
│  │     Execution Log (SSE stream)      │ │
│  └─────────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │ REST + SSE
┌──────────────────▼──────────────────────┐
│           Backend (FastAPI)              │
│  ┌──────────────────────────────────┐   │
│  │  Workflow Engine (topo sort)     │   │
│  └──────────────────────────────────┘   │
│  ┌──────────┐ ┌────────┐ ┌──────────┐  │
│  │ Agents   │ │ Tools  │ │ SQLite   │  │
│  │ Registry │ │(Search)│ │   DB     │  │
│  └──────────┘ └────────┘ └──────────┘  │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   OpenAI GPT API    │
        └─────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API key (or use mock mode)

### 1. Clone the repo
```bash
git clone https://github.com/shreya-rgb/AgentFlow---AI-Workflow-Builder.git
cd AgentFlow---AI-Workflow-Builder/agent-flow-builder
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OpenAI API key
```

Start the backend:
```bash
python main.py
```
Backend runs at **http://localhost:8000**

> **No API key?** Set `MOCK_MODE=true` in `.env` for simulated responses.

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
```

Start the frontend:
```bash
npm run dev
# Windows: node node_modules/next/dist/bin/next dev
```
Frontend runs at **http://localhost:3000**

---

## ☁️ Deployment

### Frontend → Vercel (free)
1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. Set **Root Directory** to `agent-flow-builder/frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app`
4. Deploy ✅

### Backend → Railway (free)
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `agent-flow-builder/backend`
3. Add environment variables:
   - `OPENAI_API_KEY=sk-...`
   - `MOCK_MODE=false`
4. Deploy ✅

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React Flow, Zustand |
| Backend | Python FastAPI, Uvicorn |
| AI | OpenAI GPT-4o / GPT-4o-mini |
| Web Search | DuckDuckGo (free, no API key) |
| Real-time | Server-Sent Events (SSE) |
| Database | SQLite |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 📁 Project Structure

```
agent-flow-builder/
├── frontend/                  # Next.js App
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React components
│   │   │   ├── Canvas.js      # React Flow canvas
│   │   │   ├── Sidebar.js     # Agent drag list
│   │   │   ├── ConfigPanel.js # Node settings
│   │   │   ├── ExecutionLog.js# Real-time logs
│   │   │   ├── TopBar.js      # Save/Load/Templates
│   │   │   └── nodes/         # Custom node types
│   │   ├── store/             # Zustand state
│   │   └── utils/             # API helpers
│   └── package.json
│
├── backend/                   # FastAPI App
│   ├── main.py                # Routes + SSE
│   ├── engine.py              # Workflow executor
│   ├── agents.py              # Agent definitions
│   ├── tools.py               # Web search tool
│   ├── models.py              # Pydantic models
│   ├── database.py            # SQLite helpers
│   └── requirements.txt
│
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## 📄 License

MIT © [Shreya](https://github.com/shreya-rgb)

---

<div align="center">
Built with ❤️ using Next.js, FastAPI, and OpenAI
</div>
