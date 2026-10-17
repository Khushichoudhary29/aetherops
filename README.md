# AETHEROPS 🚀
> **Stateful, Event-Driven Multi-Agent Control Center for Enterprise AI Operations**

[![Python](https://img.shields.io/badge/Python-3.11%2B-brightgreen)](README.md)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-teal)](README.md)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.25-orange)](README.md)
[![Google_Gemini](https://img.shields.io/badge/Gemini_API-1.5_Flash-blue)](README.md)
[![React](https://img.shields.io/badge/React-18.2-blue)](README.md)
[![React_Flow](https://img.shields.io/badge/React_Flow-%40xyflow%2Freact-purple)](README.md)

---

## 📌 Project Overview
**AetherOps** is an autonomous multi-agent operational platform built to resolve standard AI bottlenecks like hallucinations, unhandled runtime code crashes, and lack of execution feedback.

Instead of generating simple text output through a single prompt, AetherOps decomposes user goals into an ordered **Directed Acyclic Graph (DAG)** and delegates tasks across 5 specialized LLM agents. Generated code runs inside an **isolated Python subprocess sandbox**, capturing `stdout`, `stderr`, and exit status codes. If a runtime crash occurs, a **Closed-Loop Self-Healing mechanism** captures the traceback and routes it back to the Coder Agent for automatic refactoring without human intervention. The complete pipeline is visualized live via WebSockets on an interactive React Flow canvas.

---

## 👥 Team Work Distribution

| Team Member | Module Assigned | Scope & Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Core Backend & Dashboard 1** | Central LangGraph state machine, Google Gemini LLM API, Subprocess Sandbox Runner, WebSockets hub, React Flow DAG Canvas, Mini Task Manager, and Pipeline Report Export. | **Completed & Tested** |
| **Member 2** | **Dashboard 2 (AgentOps Telemetry)** | Real-time observability dashboard tracking token burn rates, per-node execution latency graphs, error recovery analytics via `Recharts`, and terminal log streams via `xterm.js`. | *Integration Slot Ready* |
| **Member 3** | **Dashboard 3 (Security & HITL)** | Human-in-the-Loop (HITL) approval gates, guardrail policy enforcement, dangerous command blocking (`rm -rf`, raw sockets), and manual prompt injection controls. | *Integration Slot Ready* |

---

## 📋 Module Breakdown by Member

### 1. Member 1: Core Architecture & Dashboard 1
- **LangGraph Multi-Agent Engine**: 5-agent state graph (Supervisor, Coder, Auditor, Sandbox Runner, Reviewer).
- **Subprocess Sandbox & Self-Healing**: Isolated script execution with stdout/stderr capture and auto-refactoring feedback loop.
- **Google Gemini LLM Service**: Live code synthesis with safe offline fallback mode.
- **Full-Duplex WebSockets**: Real-time event broadcasting to connected frontend dashboards.
- **Dashboard 1 (DAG Canvas)**: Interactive React Flow graph, Mini Task Manager, code viewer/editor, and execution report export.

### 2. Member 2: AgentOps Telemetry Station (Dashboard 2)
- **Token & Cost Analytics**: Interactive Recharts components displaying token consumption and cumulative API cost.
- **Latency Monitoring**: Per-node execution duration metrics to identify pipeline bottlenecks.
- **Live Terminal Stream**: Integration with `xterm.js` for streaming raw stdout/stderr logs.
- **Error vs. Recovery Rates**: Statistical visualization of self-healing success frequency.

### 3. Member 3: Security & HITL Governance (Dashboard 3)
- **Guardrail Policy Rules**: Regex and pattern-based interceptor for hazardous commands and unauthorized file access.
- **HITL Approval Gate**: State machine pause/resume mechanism allowing human evaluators to Approve or Reject agent actions.
- **Mid-Flight Prompt Injection**: Interface allowing operators to inject custom corrective prompts before execution continues.
- **Security Audit Logs**: Persistent logging of all security scan decisions and human approvals.

---

## 🤝 Internal Team Reference (Hinglish)

- **Member 1 (Done):**
  - Pura backend engine (`FastAPI` + `LangGraph`), Gemini LLM service (`backend/app/llm.py`), isolated subprocess sandbox, aur WebSocket hub complete kar diya hai.
  - Frontend me **Dashboard 1** fully ready hai jisme React Flow canvas, Mini Task Manager, Code Editor/Viewer, Pipeline Report Export, aur Light/Dark mode included hai.
  - Ab repo GitHub par pushed hai aur ready hai agle members ke kaam ke liye.

- **Member 2 (Aapka Kaam):**
  - Repo clone karein aur `frontend/src/components/Dashboard2_Placeholder.jsx` me kaam shuru karein.
  - Backend se aane wale token counts aur node latency data ko `Recharts` library use karke Bar Chart aur Line Chart me show karein.
  - Live execution logs ke liye `xterm.js` terminal view implement karein taaki terminal output live scroll ho sake.

- **Member 3 (Aapka Kaam):**
  - Repo clone karein aur `frontend/src/components/Dashboard3_Placeholder.jsx` me kaam shuru karein.
  - Security policies define karein (jaise prohibited keywords: `rm -rf`, `os.system`, restricted network access).
  - Jab koi restricted call flag ho, toh execution pause ho jaye aur screen par Human-in-the-Loop modal aaye jisme **Approve**, **Reject**, aur **Inject Custom Prompt** ke buttons kaam karein.

---

## 🏗️ System Architecture

```text
                        +---------------------------------------------+
                        |        REACT MULTI-DASHBOARD FRONTEND       |
                        +----------------------+----------------------+
                                               |
             +---------------------------------+---------------------------------+
             |                                 |                                 |
             v                                 v                                 v
   +--------------------+            +--------------------+            +--------------------+
   |    DASHBOARD 1     |            |    DASHBOARD 2     |            |    DASHBOARD 3     |
   | DAG Canvas & Code  |            | AgentOps Telemetry |            |   HITL Security    |
   | (Member 1 - Done)  |            |     (Member 2)     |            |     (Member 3)     |
   +---------+----------+            +--------------------+            +--------------------+
             |
             +===================================================================+
                                                                                 | Full-Duplex WebSockets
                                                                                 v
                                                               +-----------------------------------+
                                                               |          FASTAPI BACKEND          |
                                                               |     WebSocket Broadcast Hub       |
                                                               +-----------------+-----------------+
                                                                                 |
                                                                                 v
                                                               +-----------------------------------+
                                                               |      LANGGRAPH ORCHESTRATOR       |
                                                               |  - Supervisor Planner Agent       |
                                                               |  - Coder Agent (Google Gemini)    |
                                                               |  - Security Auditor Agent         |
                                                               |  - Sandbox Execution Runner       |
                                                               |  - Reviewer Agent                 |
                                                               +-----------------+-----------------+
                                                                                 |
                                                                                 v
                                                               +-----------------------------------+
                                                               |   SUBPROCESS EXECUTION SANDBOX    |
                                                               | Captures stdout, stderr, exit code|
                                                               |   Triggers Self-Healing Loop      |
                                                               +-----------------------------------+
```

---

## 📂 Project Directory Structure

```text
aetherops/
├── backend/                       # Backend Engine (Python 3.11 + FastAPI)
│   ├── app/
│   │   ├── main.py                # Server entrypoint (REST APIs & WebSocket router)
│   │   ├── llm.py                 # Google Gemini LLM service with fail-safe fallback
│   │   ├── config.py              # App settings & environment variable loader
│   │   ├── websocket_manager.py   # Full-duplex real-time state sync dispatcher
│   │   ├── graph/
│   │   │   ├── orchestrator.py    # LangGraph state machine & multi-agent workflow
│   │   │   └── state.py           # DAG node, edge, and execution state schemas
│   │   └── sandbox/
│   │       └── runner.py          # Isolated Python subprocess runner (captures stdout/stderr)
│   ├── .env.example               # Template for Gemini API key configuration
│   └── requirements.txt           # Python backend dependencies
│
├── frontend/                      # Frontend UI (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── App.jsx                # Main navigation shell & Light/Dark mode switcher
│   │   ├── index.css              # Custom styling & scrollbar design
│   │   └── components/
│   │       ├── Dashboard1_DagCanvas.jsx   # [Member 1] React Flow DAG Canvas, Task Manager, Code Panel
│   │       ├── Dashboard2_Placeholder.jsx # [Member 2] AgentOps Telemetry Station Slot
│   │       └── Dashboard3_Placeholder.jsx # [Member 3] Security & HITL Terminal Slot
│   └── package.json               # Frontend dependencies (@xyflow/react, lucide-react)
│
└── README.md                      # Project documentation & team workflow
```

---

## ⚡ Quickstart Guide (Run in 2 Steps)

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
python -m app.main
```
> Backend runs at: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
> Frontend opens at: `http://localhost:5173`

---

## 🔑 Environment Configuration (Optional)
AetherOps includes an automatic fail-safe fallback. If no API key is provided, the system seamlessly runs in local deterministic mode.

To enable **Live AI Code Synthesis** using Google Gemini:
1. Create a `.env` file inside `backend/`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Add your free Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
*(Free key available at: [Google AI Studio](https://aistudio.google.com/))*
