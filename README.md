# AETHEROPS 🚀
> **Stateful, Event-Driven Multi-Agent Control Center for Enterprise AI Operations**

[![COER University](https://img.shields.io/badge/University-COER_University_Roorkee-blue)](file:///C:/Users/User/.gemini/antigravity-ide/scratch/aetherops/README.md)
[![Python](https://img.shields.io/badge/Python-3.11%2B-brightgreen)](file:///C:/Users/User/.gemini/antigravity-ide/scratch/aetherops/README.md)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-teal)](file:///C:/Users/User/.gemini/antigravity-ide/scratch/aetherops/README.md)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.25-orange)](file:///C:/Users/User/.gemini/antigravity-ide/scratch/aetherops/README.md)
[![React](https://img.shields.io/badge/React-18.2-blue)](file:///C:/Users/User/.gemini/antigravity-ide/scratch/aetherops/README.md)
[![React_Flow](https://img.shields.io/badge/React_Flow-%40xyflow%2Freact-purple)](file:///C:/Users/User/.gemini/antigravity-ide/scratch/aetherops/README.md)

---

## 📌 Project Synopsis & Academic Details
- **Degree**: Bachelor of Technology (B.Tech) - Computer Science and Engineering
- **Institution**: Department of Computer Science & Engineering, College of Smart Computing, COER University, Roorkee, Uttarakhand
- **Supervisor**: Ms. Nidhi Rana
- **Academic Year**: September 2026

---

## 👥 Team Members & Responsibilities Division

| Member | Name | Student ID | Designated Role & Module Scope | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Khushi Choudhary** | `243025127` | **Lead Systems & Canvas Architect**: Core Backend Engine (`FastAPI` + `LangGraph`), Subprocess Sandbox Execution Runner, Full-Duplex WebSocket Dispatcher, Repository Foundation & **Dashboard 1: Dynamic DAG Orchestration Canvas (React Flow) & Multimodal Output Viewer**. | **Implemented & Maintained** |
| **Member 2** | **Pragya Singhal** | `243025178` | **AgentOps & Telemetry Specialist**: **Dashboard 2: AgentOps Telemetry Station** (`Recharts` metrics tracking token burn rates, latency, self-healing recovery + `xterm.js` live execution terminal). | *Integration Slot Ready* |
| **Member 3** | **Riya Choudhary** | `243025202` | **Security & Governance Specialist**: **Dashboard 3: Human-in-the-Loop (HITL) Security Terminal** (Safety guardrails, restricted call interrupts, approval breakpoints, prompt injection). | *Integration Slot Ready* |

---

## 🏗️ System Architecture

```
                                 +-----------------------------------+
                                 |         REACT FRONTEND            |
                                 |  (Single Page Multi-Dashboard)    |
                                 +-----------------+-----------------+
                                                   |
                     +-----------------------------+-----------------------------+
                     |                             |                             |
                     v                             v                             v
           +-------------------+         +-------------------+         +-------------------+
           |    DASHBOARD 1    |         |    DASHBOARD 2    |         |    DASHBOARD 3    |
           |  DAG Canvas &     |         | AgentOps Telemetry|         |   HITL Security   |
           |  Multimodal View  |         | (Pragya - Mem 2)  |         |   (Riya - Mem 3)  |
           | (Khushi - Mem 1)  |         +-------------------+         +-------------------+
           +---------+---------+
                     |
                     +===================================================+
                                                                         | Full-Duplex WebSockets
                                                                         v
                                                       +-----------------------------------+
                                                       |          FASTAPI BACKEND          |
                                                       |     WebSocket Broadcast Engine    |
                                                       +-----------------+-----------------+
                                                                         |
                                                                         v
                                                       +-----------------------------------+
                                                       |     LANGGRAPH ORCHESTRATOR        |
                                                       |  - Supervisor Planner Node        |
                                                       |  - Coder Agent Node               |
                                                       |  - Sandbox Execution Runner Node  |
                                                       |  - Reviewer Agent Node            |
                                                       +-----------------+-----------------+
                                                                         |
                                                                         v
                                                       +-----------------------------------+
                                                       |   SUBPROCESS EXECUTION SANDBOX    |
                                                       | Capture stdout, stderr, exit code |
                                                       +-----------------------------------+
```

---

## ✨ Features Implemented by Member 1 (Khushi)

### 1. Central LangGraph State Graph Machine
- Decomposes high-level unstructured goals into ordered Directed Acyclic Graph (DAG) state schemas.
- Manages real-time node state transitions across:
  - `pending` (Gray)
  - `running` (Pulsing Cyan)
  - `self_healing` (Amber Warning)
  - `hitl_paused` (Purple Intercept)
  - `completed` (Emerald Success)

### 2. Isolated Subprocess Sandbox Runner
- Executes synthesized Python code within isolated subprocesses.
- Captures `stdout`, `stderr`, execution duration, and exit status codes.
- Triggers dynamic self-healing refactoring when non-zero exit codes or runtime exceptions occur.

### 3. Dashboard 1: Dynamic DAG Orchestration Canvas (React Flow)
- Interactive visual graph node mapping rendered with `@xyflow/react`.
- Smooth animated state edges indicating active data flows.
- **Node Details Inspector**: Slide-over drawer displaying step-by-step agent instructions and outputs.
- **Multimodal Output Rendering Panel**:
  - Code Editor View with syntax formatting
  - Structured JSON State Inspection
  - Generated Markdown / Documentation Previewer
  - Real-Time Execution Log Console

---

## 📂 Repository Directory Layout

```
aetherops/
├── README.md                          # Main Project Documentation & Team Division
├── .gitignore                         # Environment & Build Ignore Rules
├── backend/                           # Python FastAPI + LangGraph Engine
│   ├── app/
│   │   ├── main.py                    # FastAPI Entrypoint & REST/WS Routes
│   │   ├── config.py                  # Server Configuration & Defaults
│   │   ├── websocket_manager.py       # Full-Duplex WebSocket Dispatcher
│   │   ├── graph/
│   │   │   ├── state.py               # Graph State Dictionary Schemas
│   │   │   └── orchestrator.py        # LangGraph Workflow Machine
│   │   └── sandbox/
│   │       └── runner.py              # Isolated Subprocess Code Runner
│   └── requirements.txt               # Backend Python Dependencies
└── frontend/                          # React + Vite + Tailwind UI
    ├── index.html                     # HTML Template
    ├── vite.config.js                 # Vite Setup
    ├── tailwind.config.js             # Tailwind CSS Design Configuration
    ├── package.json                   # Frontend Package Dependencies
    └── src/
        ├── App.jsx                    # Multi-Dashboard Navigation Shell
        ├── index.css                  # Global Styles & Animation Utilities
        ├── components/
        │   ├── Dashboard1_DagCanvas.jsx   # [MEMBER 1 - KHUSHI] React Flow DAG Canvas & Multimodal View
        │   ├── Dashboard2_Placeholder.jsx # [MEMBER 2 - PRAGYA] Telemetry Station Integration Slot
        │   └── Dashboard3_Placeholder.jsx # [MEMBER 3 - RIYA] Security Terminal Integration Slot
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js v20+

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m app.main
```
> Server will start at: `http://localhost:8000`

### Step 2: Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite dev server
npm run dev
```
> Application will open at: `http://localhost:5173`

---

## 🔌 API & WebSocket Documentation

### REST Endpoints
- `GET /api/health`: System status check.
- `POST /api/dag/create`: Ingest user goal prompt and construct initial DAG state.
- `POST /api/dag/step`: Trigger state execution for the next pending agent node.

### WebSocket Endpoint
- `ws://localhost:8000/ws/dag`: Real-time full-duplex WebSocket streaming graph node transitions, execution logs, and multimodal artifact payloads.

---

## 📄 License & Attribution
Developed as part of the Senior B.Tech Capstone Project at **COER University, Roorkee, Uttarakhand**.  
Copyright © 2026 AetherOps Team. All Rights Reserved.
