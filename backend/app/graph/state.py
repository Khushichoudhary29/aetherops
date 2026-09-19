from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DAGNode(BaseModel):
    id: str
    type: str = "agentNode"  # planner, coder, sandbox, auditor, reviewer
    label: str
    status: str = "pending"  # pending, running, self_healing, hitl_paused, completed, failed
    agent_type: str          # Supervisor, Coder, Execution Sandbox, Security Auditor, Reviewer
    description: str
    code_artifact: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    exit_code: Optional[int] = None
    latency_ms: Optional[float] = 0.0
    token_usage: Optional[int] = 0

class DAGEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: bool = False

class MultimodalArtifact(BaseModel):
    type: str  # code, json, markdown, logs
    title: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AetherOpsGraphState(BaseModel):
    task_id: str
    user_goal: str
    status: str = "initialized"
    nodes: List[DAGNode] = Field(default_factory=list)
    edges: List[DAGEdge] = Field(default_factory=list)
    current_node_id: Optional[str] = None
    artifacts: List[MultimodalArtifact] = Field(default_factory=list)
    execution_logs: List[str] = Field(default_factory=list)
    total_tokens: int = 0
    total_cost: float = 0.0
