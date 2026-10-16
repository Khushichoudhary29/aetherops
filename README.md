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

## 👥 Team Work Distribution (Student Level)

| Team Member | Module Assigned | Work Status |
| :--- | :--- | :--- |
| **Member 1** | **Core Backend & Dashboard 1**: LangGraph state machine, Google Gemini LLM API, Subprocess Sandbox Runner, WebSockets hub, and Dashboard 1 (React Flow Canvas, Mini Task Manager, Code Editor & Viewer). | **Completed & Tested** |
| **Member 2** | **Dashboard 2**: AgentOps Telemetry Station (Metrics for token burn rate, node latency graphs, error recovery rate, and terminal logs). | *Pending / Integration Slot Ready* |
| **Member 3** | **Dashboard 3**: Security & HITL Terminal (Human approval buttons, security policy checks, restricted command blocking). | *Pending / Integration Slot Ready* |

> 💡 **[Team Guide (Hinglish - For Internal Team Reference)]:**  
> *(Note: Yeh section team coordination ke liye hai, final evaluation se pehle ise easily delete kar sakte hain)*  
> - **Member 1 (Done):** Pura core backend, real Gemini LLM integration (`backend/app/llm.py`), isolated subprocess code sandbox, WebSockets, aur **Dashboard 1 (Interactive Canvas, Task Manager, Code Editor, Self-Healing Demo, Light/Dark theme)** complete aur test kar diya hai. Repo GitHub par ready hai.
> - **Member 2 (Aapka Kaam):** Repo clone karke `frontend/src/components/Dashboard2_Placeholder.jsx` me token cost aur latency ke graphs (`Recharts`) lagane hain.
> - **Member 3 (Aapka Kaam):** `frontend/src/components/Dashboard3_Placeholder.jsx` me security guardrail policies aur Human-in-the-Loop approval buttons (Approve/Reject) lagane hain.

---

## 🛠️ Detailed Features Implemented by Member 1

Member 1 ne project ka foundational architecture aur complete Dashboard 1 tayyar kiya hai:

1. **LangGraph State Graph Engine (`backend/app/graph/orchestrator.py`):**
   - Natural language prompt ko 5 specialized agent nodes me todta hai:
     - 🧠 **Supervisor Planner**: Prompt ko sub-tasks aur dependency graph me convert karta hai.
     - 💻 **Coder Agent**: Executable Python code likhta hai (Google Gemini LLM ke through).
     - 🛡️ **Security Auditor**: Code scan karta hai harmful commands ke liye.
     - ⚙️ **Execution Sandbox Runner**: Isolated subprocess me code run karta hai.
     - 🔍 **Reviewer Agent**: Final output aur task report verify karta hai.

2. **Subprocess Sandbox & Self-Healing Loop (`backend/app/sandbox/runner.py`):**
   - Generated code ko background Python subprocess me run karta hai.
   - Code ka `stdout`, `stderr`, execution latency (ms), aur exit code capture karta hai.
   - **Self-Healing:** Agar non-zero exit code ya exception aaye, toh error traceback wapas Coder Agent ko jata hai aur code auto-fix hota hai.

3. **Google Gemini LLM Integration (`backend/app/llm.py`):**
   - Google Gemini API (`gemini-1.5-flash`) live code synthesis ke liye integrate kiya gaya hai.
   - **Smart Fallback:** Agar API key na ho ya quota limit exceed ho, toh system local deterministic mode me switch ho jata hai taaki presentation ke time project kabhi crash na ho.

4. **Full-Duplex WebSockets (`backend/app/websocket_manager.py`):**
   - `/ws/dag` endpoint ke zariye backend graph ke state mutations bina page reload kiye React frontend par instantly push hote hain.

5. **Dashboard 1: Dynamic DAG Canvas (`frontend/src/components/Dashboard1_DagCanvas.jsx`):**
   - `@xyflow/react` (React Flow) par based interactive visual task graph.
   - Node status indicators: **Pending**, **Running (Pulsing)**, **Self-Healing (Amber)**, **Completed (Emerald)**.
   - Mouse wheel scroll aur pan navigation support.

6. **Mini Task Manager Drawer:**
   - Custom subtasks add karne, delete karne, aur unka status (Pending ➔ Active ➔ Done) direct toggle karne ke liye interactive widget. Graph ke saath live sync hota hai.

7. **Multimodal Output Panel (Right Side):**
   - **Code Tab**: Synthesized code dekhne, live edit karne, one-click copy karne, aur `.py` script download karne ke options.
   - **Logs Tab**: Real-time WebSocket terminal logs stream.
   - **Inspector Tab**: Graph ke kisi bhi node par click karke uska STDOUT, STDERR, token usage aur latency inspect karne ki suvidha.

8. **Theme & Execution Controls:**
   - **Light / Dark Mode Switcher**: Header me Sun/Moon button se ek click me clean Light Mode ya Dark Mode switch hota hai.
   - **Step Button**: Ek-ek node ko run karke dikhane ke liye (viva ke liye ideal).
   - **Auto-Run**: Poore workflow ko ek click me start-to-end run karne ke liye.
   - **Self-Healing Demo**: Runtime error inject karke self-healing loop demonstrate karne ke liye.

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

## 📂 Project Directory Structure (For Faculty Presentation)

Jab aap VS Code me project faculty ko dikhayengi, toh structure simple aur 2 parts me explainable hai:

```text
aetherops/
├── backend/                       # BRAIN & EXECUTION ENGINE (Python 3.11 + FastAPI)
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
├── frontend/                      # VISUAL CONTROL CENTER (React + Vite + TailwindCSS)
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
AetherOps me built-in fallback hai, isliye API key ke bina bhi project smooth chalta hai.

Live Gemini AI Code synthesis on karne ke liye:
1. `backend/` me `.env` file banayein:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Apni free Google Gemini API key daalein:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
*(Free key available at: [Google AI Studio](https://aistudio.google.com/))*
