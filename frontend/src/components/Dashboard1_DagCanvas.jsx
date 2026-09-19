import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState, 
  useEdgesState, 
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Play, 
  FastForward, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  Code2, 
  FileText, 
  Terminal, 
  Cpu, 
  Sparkles,
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';

// Custom React Flow Node Component for AetherOps Agents
const CustomAgentNode = ({ data }) => {
  const getStatusStyle = () => {
    switch (data.status) {
      case 'running':
        return 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse';
      case 'self_healing':
        return 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse';
      case 'completed':
        return 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300';
      case 'hitl_paused':
        return 'border-purple-500 bg-purple-950/40 text-purple-300';
      case 'failed':
        return 'border-red-500 bg-red-950/40 text-red-300';
      default:
        return 'border-gray-800 bg-gray-900/90 text-gray-400';
    }
  };

  const getStatusBadge = () => {
    switch (data.status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-semibold">
            <Loader2 className="w-3 h-3 animate-spin" /> RUNNING
          </span>
        );
      case 'self_healing':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
            <AlertTriangle className="w-3 h-3" /> SELF-HEALING
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-semibold">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className={`w-64 p-3.5 rounded-xl border-2 transition-all duration-300 ${getStatusStyle()}`}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-3 !h-3" />
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
          {data.agent_type}
        </span>
        {getStatusBadge()}
      </div>

      <div className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="truncate">{data.label}</span>
      </div>

      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
        {data.description}
      </p>

      {data.latency_ms > 0 && (
        <div className="mt-2.5 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[10px] text-gray-500 font-mono">
          <span>Latency: {data.latency_ms}ms</span>
          <span>{data.token_usage || 0} tokens</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-500 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = {
  agentNode: CustomAgentNode,
};

export default function Dashboard1_DagCanvas() {
  const [userGoal, setUserGoal] = useState('Build a Python script that calculates prime numbers and benchmarks memory usage');
  const [taskId, setTaskId] = useState(null);
  const [dagState, setDagState] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState('code');
  const [isExecuting, setIsExecuting] = useState(false);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Map backend graph nodes to React Flow layout
  const updateReactFlowGraph = useCallback((graphState) => {
    if (!graphState || !graphState.nodes) return;

    const layoutPositions = {
      'node-supervisor': { x: 250, y: 30 },
      'node-coder': { x: 250, y: 180 },
      'node-auditor': { x: 250, y: 330 },
      'node-sandbox': { x: 250, y: 480 },
      'node-reviewer': { x: 250, y: 630 },
    };

    const flowNodes = graphState.nodes.map((node) => ({
      id: node.id,
      type: 'agentNode',
      position: layoutPositions[node.id] || { x: 250, y: 100 },
      data: { ...node },
    }));

    const flowEdges = graphState.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated || nodeIsRunning(graphState, edge.source),
      style: { stroke: edge.source === 'node-sandbox' && edge.target === 'node-coder' ? '#F59E0B' : '#38BDF8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [setNodes, setEdges]);

  const nodeIsRunning = (state, nodeId) => {
    const node = state.nodes.find(n => n.id === nodeId);
    return node && (node.status === 'running' || node.status === 'self_healing');
  };

  // Connect to WebSocket for real-time state sync
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/dag`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected to FastAPI Orchestrator');
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.state) {
          setDagState(payload.state);
          updateReactFlowGraph(payload.state);
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    return () => ws.close();
  }, [updateReactFlowGraph]);

  // Create initial DAG task
  const handleCreateDag = async () => {
    if (!userGoal.trim()) return;
    setIsExecuting(true);
    try {
      const res = await fetch('/api/dag/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_goal: userGoal }),
      });
      const data = await res.json();
      if (data.success) {
        setTaskId(data.task_id);
        setDagState(data.state);
        updateReactFlowGraph(data.state);
      }
    } catch (err) {
      console.error('Failed to create DAG task:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Step execution for next pending node
  const handleStepNode = async () => {
    if (!taskId) return;
    setIsExecuting(true);
    try {
      const res = await fetch('/api/dag/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      });
      const data = await res.json();
      if (data.state) {
        setDagState(data.state);
        updateReactFlowGraph(data.state);
      }
    } catch (err) {
      console.error('Failed to step node:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Auto-run complete graph execution
  const handleAutoRun = async () => {
    if (!taskId) return;
    setIsExecuting(true);
    let isDone = false;
    while (!isDone) {
      try {
        const res = await fetch('/api/dag/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: taskId }),
        });
        const data = await res.json();
        if (data.state) {
          setDagState(data.state);
          updateReactFlowGraph(data.state);
        }
        if (data.status === 'completed') {
          isDone = true;
        } else {
          await new Promise(r => setTimeout(r, 800));
        }
      } catch (err) {
        isDone = true;
      }
    }
    setIsExecuting(false);
  };

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-darkBg text-gray-100 overflow-hidden">
      
      {/* Top Controls & Goal Prompt Input Bar */}
      <div className="p-4 bg-cardBg border-b border-panelBorder flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[320px]">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            placeholder="Enter high-level prompt goal (e.g. Build a web scraper, analyze dataset...)"
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            onClick={handleCreateDag}
            disabled={isExecuting}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg flex items-center gap-2"
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Decompose & Generate DAG</span>
          </button>
        </div>

        {/* Execution Flow Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStepNode}
            disabled={!taskId || isExecuting}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 text-xs font-semibold rounded-lg border border-gray-700 flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step Next Node</span>
          </button>

          <button
            onClick={handleAutoRun}
            disabled={!taskId || isExecuting}
            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 disabled:opacity-40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
          >
            <FastForward className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Run Flow</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace: DAG Canvas (Left) + Multimodal Output Viewer (Right) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: React Flow Orchestration Canvas */}
        <div className="flex-1 relative bg-[#0B0F19]">
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-darkBg/90">
              <Cpu className="w-12 h-12 text-gray-600 mb-3 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-300 mb-1">AetherOps DAG Canvas Initialized</h3>
              <p className="text-xs text-gray-500 max-w-md mb-4">
                Enter a high-level goal in the top prompt bar and click <strong className="text-cyan-400">Decompose & Generate DAG</strong> to construct the LangGraph task execution pipeline.
              </p>
            </div>
          ) : null}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="w-full h-full"
          >
            <Background color="#1F2937" gap={24} size={1} />
            <Controls />
            <MiniMap 
              nodeColor={(n) => n.data?.status === 'completed' ? '#10B981' : n.data?.status === 'running' ? '#06B6D4' : '#374151'}
              maskColor="rgba(11, 15, 25, 0.7)"
              className="!bg-cardBg !border-gray-800"
            />
          </ReactFlow>

          {/* Floating Status Bar Overlay */}
          {dagState && (
            <div className="absolute bottom-4 left-4 z-10 bg-cardBg/90 backdrop-blur border border-panelBorder rounded-lg p-3 text-xs flex items-center gap-4 text-gray-300 shadow-xl font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Task: <strong className="text-white">{dagState.task_id}</strong>
              </span>
              <span>Tokens: <strong className="text-cyan-400">{dagState.total_tokens}</strong></span>
              <span>Cost: <strong className="text-emerald-400">${dagState.total_cost}</strong></span>
            </div>
          )}
        </div>

        {/* Right Side: Multimodal Output Viewer & Node Inspector Panel */}
        <div className="w-96 bg-cardBg border-l border-panelBorder flex flex-col h-full overflow-hidden">
          
          {/* Panel Tab Header */}
          <div className="flex items-center border-b border-panelBorder bg-gray-950/60 p-2 gap-1 text-xs">
            <button
              onClick={() => setActiveArtifactTab('code')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${activeArtifactTab === 'code' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>

            <button
              onClick={() => setActiveArtifactTab('logs')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${activeArtifactTab === 'logs' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Logs</span>
            </button>

            <button
              onClick={() => setActiveArtifactTab('inspector')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${activeArtifactTab === 'inspector' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>
          </div>

          {/* Panel Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
            
            {/* Tab 1: Code Viewer */}
            {activeArtifactTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-semibold text-white">Synthesized Code Output</span>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Python 3.11</span>
                </div>
                
                {dagState?.artifacts?.find(a => a.type === 'code') ? (
                  <pre className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-cyan-300 overflow-x-auto leading-relaxed">
                    {dagState.artifacts.find(a => a.type === 'code').content}
                  </pre>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Code2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No synthesized code artifact generated yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Logs Viewer */}
            {activeArtifactTab === 'logs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-semibold text-white">Execution Stream Logs</span>
                  <span className="text-[10px] text-cyan-400">Live WebSockets</span>
                </div>

                <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg space-y-2 text-gray-300 max-h-[500px] overflow-y-auto">
                  {dagState?.execution_logs?.length ? (
                    dagState.execution_logs.map((log, idx) => (
                      <p key={idx} className="text-gray-400 border-b border-gray-900 pb-1">{log}</p>
                    ))
                  ) : (
                    <p className="text-gray-600 italic">No logs recorded.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Node Detail Inspector */}
            {activeArtifactTab === 'inspector' && (
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm">Node Details Inspector</h4>
                
                {selectedNode ? (
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 space-y-2">
                    <div>
                      <span className="text-gray-500">Label:</span> <strong className="text-white">{selectedNode.label}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Agent:</span> <span className="text-cyan-400">{selectedNode.agent_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span> <span className="uppercase text-amber-400 font-bold">{selectedNode.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>
                      <p className="text-gray-400 text-[11px] mt-1">{selectedNode.description}</p>
                    </div>

                    {selectedNode.stdout && (
                      <div className="mt-2 pt-2 border-t border-gray-800">
                        <span className="text-emerald-400">STDOUT:</span>
                        <pre className="p-2 bg-black rounded text-[10px] text-gray-300 mt-1 whitespace-pre-wrap">{selectedNode.stdout}</pre>
                      </div>
                    )}

                    {selectedNode.stderr && (
                      <div className="mt-2 pt-2 border-t border-gray-800">
                        <span className="text-red-400">STDERR:</span>
                        <pre className="p-2 bg-black rounded text-[10px] text-red-300 mt-1 whitespace-pre-wrap">{selectedNode.stderr}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Click any node on the canvas to inspect its runtime payload and tracebacks.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
