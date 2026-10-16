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
**AetherOps** is an autonomous multi-agent operational platform engineered to overcome the limitations of standard monolithic LLMs (hallucinations, lack of execution feedback, and unhandled runtime exceptions). 

Instead of generating unverified text in a single prompt, AetherOps decomposes user goals into a structured **Directed Acyclic Graph (DAG)** and distributes work across 5 specialized LLM agents. Generated code is executed inside an **isolated Python subprocess sandbox**, and any runtime exceptions automatically trigger a **Closed-Loop Self-Healing mechanism** that refactors and re-verifies the code without human intervention. The entire execution graph is visualized live via full-duplex WebSockets on an interactive React Flow canvas.

---

## 👥 Team Work Distribution

| Role | Designated Responsibility & Scope | Current Status |
| :--- | :--- | :--- |
| **Member 1** *(Lead Systems & Canvas Architect)* | **Core Architecture**: FastAPI + LangGraph state machine, Google Gemini LLM service, Subprocess Sandbox Runner, Full-Duplex WebSocket Dispatcher, and **Dashboard 1: Dynamic DAG Canvas & Multimodal Viewer**. | **Completed & Maintained** |
| **Member 2** *(AgentOps & Telemetry Specialist)* | **Dashboard 2: AgentOps Telemetry Station**: Metrics tracking token burn rates, execution latency per node, error-recovery frequencies via `Recharts`, and terminal logs via `xterm.js`. | *Integration Slot Ready* |
| **Member 3** *(Security & Governance Specialist)* | **Dashboard 3: Security & HITL Terminal**: Human-in-the-Loop approval breakpoints, safety guardrail policies, restricted system command interception, and manual prompt overrides. | *Integration Slot Ready* |

> 💡 **[Team Guide (Hinglish - For Internal Team Reference)]:**  
> *(Note: Yeh section team coordination ke liye hai, final evaluation se pehle ise easily remove kar sakte hain)*  
> - **Member 1 (Done):** Pura core backend (`FastAPI`, `LangGraph`, `WebSockets`), real Gemini LLM integration (`app/llm.py`), isolated subprocess code sandbox, aur **Dashboard 1 (DAG Canvas, Mini Task Manager, Code Editor, Self-Healing Demo, Light/Dark theme)** complete kar diya hai. Repo shareable state me hai.
> - **Member 2 (Next):** Aapko repo clone karke `frontend/src/components/Dashboard2_Placeholder.jsx` me telemetry graphs (`Recharts` token cost, latency) lagane hain.
> - **Member 3 (Next):** Aapko `frontend/src/components/Dashboard3_Placeholder.jsx` me security policies aur Human-in-the-Loop (Approve/Reject) buttons implement karne hain.

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

Jab aap VS Code me project faculty ko dikhayengi, toh structure bilkul clean aur 2 parts me explainable hai:

```text
aetherops/
├── backend/                       # BRAIN & EXECUTION ENGINE (Python 3.11 + FastAPI)
│   ├── app/
│   │   ├── main.py                # Server entrypoint (REST APIs & WebSocket router)
│   │   ├── llm.py                 # Real Google Gemini LLM service with fail-safe fallback
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
*(Get a free key from [Google AI Studio](https://aistudio.google.com/))*
