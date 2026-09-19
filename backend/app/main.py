import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.websocket_manager import ws_manager
from app.graph.orchestrator import orchestrator

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreateTaskRequest(BaseModel):
    user_goal: str

class StepTaskRequest(BaseModel):
    task_id: str

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@app.post("/api/dag/create")
def create_dag_task(req: CreateTaskRequest):
    if not req.user_goal.strip():
        raise HTTPException(status_code=400, detail="User goal prompt cannot be empty.")
    
    state = orchestrator.create_task_dag(req.user_goal)
    return {
        "success": True,
        "task_id": state.task_id,
        "state": state.dict()
    }

@app.post("/api/dag/step")
async def step_dag_task(req: StepTaskRequest):
    try:
        result = await orchestrator.execute_next_node(req.task_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.websocket("/ws/dag")
async def websocket_dag_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection open and receive optional messages from frontend
            data = await websocket.receive_text()
            # Echo or process custom payload
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
