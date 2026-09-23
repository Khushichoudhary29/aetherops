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
  Terminal, 
  Cpu, 
  Sparkles,
  Info,
  Copy,
  Download,
  Check,
  Bug,
  Edit3,
  ListTodo,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X
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
        return 'border-slate-800 bg-slate-900/90 text-slate-400';
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
            <AlertTriangle className="w-3 h-3 animate-bounce" /> SELF-HEALING
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
          <span className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className={`w-64 p-3.5 rounded-xl border-2 transition-all duration-300 ${getStatusStyle()}`}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-3 !h-3" />
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          {data.agent_type}
        </span>
        {getStatusBadge()}
      </div>

      <div className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="truncate">{data.label}</span>
      </div>

      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
        {data.description}
      </p>

      {data.latency_ms > 0 && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
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

  // Task Manager State
  const [showTaskManager, setShowTaskManager] = useState(true);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskAgent, setNewTaskAgent] = useState('Coder Agent');
  const [taskList, setTaskList] = useState([
    { id: 'node-supervisor', label: 'Supervisor Planner', agent: 'Supervisor Agent', status: 'completed', desc: 'Decompose prompt into subtasks' },
    { id: 'node-coder', label: 'Coder Agent', agent: 'Coder Agent', status: 'completed', desc: 'Synthesize solution Python code' },
    { id: 'node-auditor', label: 'Security Auditor', agent: 'Security Auditor', status: 'completed', desc: 'Scan code for security policy' },
    { id: 'node-sandbox', label: 'Sandbox Runner', agent: 'Sandbox Runner', status: 'completed', desc: 'Execute in subprocess sandbox' },
    { id: 'node-reviewer', label: 'Reviewer Agent', agent: 'Reviewer Agent', status: 'completed', desc: 'Validate final task outputs' }
  ]);

  // Code & Demo State
  const [isCopied, setIsCopied] = useState(false);
  const [isSelfHealingDemo, setIsSelfHealingDemo] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [isEditingCode, setIsEditingCode] = useState(false);

  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Map task items and backend state into React Flow graph
  const updateReactFlowGraph = useCallback((graphState, currentTaskList = taskList) => {
    const listToRender = graphState?.nodes || currentTaskList.map(t => ({
      id: t.id,
      type: 'agentNode',
      label: t.label,
      agent_type: t.agent,
      status: t.status,
      description: t.desc || 'Task item in execution pipeline'
    }));

    const flowNodes = listToRender.map((item, idx) => ({
      id: item.id,
      type: 'agentNode',
      position: { x: 250, y: 30 + idx * 150 },
      data: { ...item },
    }));

    const flowEdges = [];
    for (let i = 0; i < listToRender.length - 1; i++) {
      flowEdges.push({
        id: `edge-${i}`,
        source: listToRender[i].id,
        target: listToRender[i + 1].id,
        animated: listToRender[i].status === 'running',
        style: { stroke: '#38BDF8', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#38BDF8' }
      });
    }

    setNodes(flowNodes);
    setEdges(flowEdges);

    if (graphState?.artifacts) {
      const codeArtifact = graphState.artifacts.find(a => a.type === 'code');
      if (codeArtifact && !customCode) {
        setCustomCode(codeArtifact.content);
      }
    }
  }, [setNodes, setEdges, customCode, taskList]);

  // Sync WebSocket
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/dag`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('WebSocket Connected to FastAPI Orchestrator');
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

  // Initial load graph render
  useEffect(() => {
    updateReactFlowGraph(dagState, taskList);
  }, []);

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
        if (data.state.nodes) {
          const syncedList = data.state.nodes.map(n => ({
            id: n.id,
            label: n.label,
            agent: n.agent_type,
            status: n.status,
            desc: n.description
          }));
          setTaskList(syncedList);
        }
        updateReactFlowGraph(data.state);
      }
    } catch (err) {
      console.error('Failed to create DAG task:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Step execution for next node
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
        if (data.state.nodes) {
          const syncedList = data.state.nodes.map(n => ({
            id: n.id,
            label: n.label,
            agent: n.agent_type,
            status: n.status,
            desc: n.description
          }));
          setTaskList(syncedList);
        }
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
          if (data.state.nodes) {
            const syncedList = data.state.nodes.map(n => ({
              id: n.id,
              label: n.label,
              agent: n.agent_type,
              status: n.status,
              desc: n.description
            }));
            setTaskList(syncedList);
          }
          updateReactFlowGraph(data.state);
        }
        if (data.status === 'completed') isDone = true;
        else await new Promise(r => setTimeout(r, 800));
      } catch (err) {
        isDone = true;
      }
    }
    setIsExecuting(false);
  };

  // Task Manager Actions: Add Subtask
  const handleAddTask = () => {
    if (!newTaskLabel.trim()) return;
    const newId = `node-custom-${Date.now()}`;
    const newTask = {
      id: newId,
      label: newTaskLabel,
      agent: newTaskAgent,
      status: 'pending',
      desc: `User added subtask assigned to ${newTaskAgent}`
    };

    const updated = [...taskList, newTask];
    setTaskList(updated);
    setNewTaskLabel('');
    updateReactFlowGraph(dagState, updated);
  };

  // Task Manager Actions: Delete Subtask
  const handleDeleteTask = (taskIdToDelete) => {
    const updated = taskList.filter(t => t.id !== taskIdToDelete);
    setTaskList(updated);
    updateReactFlowGraph(dagState, updated);
  };

  // Task Manager Actions: Toggle Task Status
  const handleToggleTaskStatus = (targetId) => {
    const nextStatusMap = {
      'pending': 'running',
      'running': 'completed',
      'completed': 'pending'
    };

    const updated = taskList.map(t => {
      if (t.id === targetId) {
        return { ...t, status: nextStatusMap[t.status] || 'pending' };
      }
      return t;
    });

    setTaskList(updated);
    updateReactFlowGraph(dagState, updated);
  };

  // Reset Canvas
  const handleResetCanvas = () => {
    setTaskId(null);
    setDagState(null);
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setCustomCode('');
    setIsSelfHealingDemo(false);
  };

  // Self-Healing Demo Simulation
  const handleTriggerSelfHealingDemo = () => {
    setIsSelfHealingDemo(true);
    const updatedList = taskList.map(t => {
      if (t.id === 'node-sandbox') return { ...t, status: 'self_healing' };
      return t;
    });
    setTaskList(updatedList);
    updateReactFlowGraph(dagState, updatedList);

    setTimeout(() => {
      const recoveredList = updatedList.map(t => {
        if (t.id === 'node-sandbox') return { ...t, status: 'completed' };
        return t;
      });
      setTaskList(recoveredList);
      updateReactFlowGraph(dagState, recoveredList);
      setIsSelfHealingDemo(false);
    }, 2500);
  };

  // Copy Code
  const handleCopyCode = () => {
    const codeToCopy = customCode || dagState?.artifacts?.find(a => a.type === 'code')?.content || '';
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download Code
  const handleDownloadCode = () => {
    const codeToDownload = customCode || dagState?.artifacts?.find(a => a.type === 'code')?.content || '';
    if (!codeToDownload) return;
    const blob = new Blob([codeToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aetherops_synthesized_script.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data);
    setActiveArtifactTab('inspector');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090D16] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Toolbar Navigation Bar */}
      <div className="p-3.5 bg-[#0F172A]/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md z-20">
        
        {/* Goal Ingestion Input */}
        <div className="flex items-center gap-2 flex-1 min-w-[320px]">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            placeholder="Enter goal instruction prompt..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            onClick={handleCreateDag}
            disabled={isExecuting}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition shadow-md flex items-center gap-1.5 shrink-0"
          >
            {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Decompose & Generate DAG</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Mini Task Manager Toggle */}
          <button
            onClick={() => setShowTaskManager(!showTaskManager)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition ${
              showTaskManager 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Mini Task Manager Panel"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Task Manager ({taskList.length})</span>
          </button>

          <button
            onClick={handleStepNode}
            disabled={!taskId || isExecuting}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step</span>
          </button>

          <button
            onClick={handleAutoRun}
            disabled={!taskId || isExecuting}
            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 disabled:opacity-40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
          >
            <FastForward className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Run</span>
          </button>

          <button
            onClick={handleTriggerSelfHealingDemo}
            disabled={isSelfHealingDemo}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-40 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
          >
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span>Self-Healing Demo</span>
          </button>

          <button
            onClick={handleResetCanvas}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition"
            title="Reset Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: React Flow Canvas */}
        <div className="flex-1 relative bg-[#090D16]">
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
            <Background color="#1E293B" gap={24} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800" />
            <MiniMap 
              nodeColor={(n) => n.data?.status === 'completed' ? '#10B981' : n.data?.status === 'running' ? '#06B6D4' : '#334155'}
              maskColor="rgba(9, 13, 22, 0.7)"
              className="!bg-slate-900 !border-slate-800"
            />
          </ReactFlow>

          {/* Floating Metrics Status Bar */}
          {dagState && (
            <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2.5 text-xs flex items-center gap-4 text-slate-300 shadow-xl font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Task: <strong className="text-white">{dagState.task_id}</strong>
              </span>
              <span>Tokens: <strong className="text-cyan-400">{dagState.total_tokens}</strong></span>
              <span>Cost: <strong className="text-emerald-400">${dagState.total_cost}</strong></span>
            </div>
          )}
        </div>

        {/* EMBEDDED MINI TASK MANAGER DRAWER/PANEL */}
        {showTaskManager && (
          <div className="w-80 bg-[#0F172A]/95 border-r border-slate-800 flex flex-col h-full shadow-2xl z-10 backdrop-blur-md">
            
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <ListTodo className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mini Task Manager</h3>
              </div>
              <button 
                onClick={() => setShowTaskManager(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Task Input Form */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 space-y-2">
              <input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Add subtask description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newTaskAgent}
                  onChange={(e) => setNewTaskAgent(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="Supervisor Agent">Supervisor Agent</option>
                  <option value="Coder Agent">Coder Agent</option>
                  <option value="Security Auditor">Security Auditor</option>
                  <option value="Sandbox Runner">Sandbox Runner</option>
                  <option value="Reviewer Agent">Reviewer Agent</option>
                </select>
                <button
                  onClick={handleAddTask}
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-md flex items-center gap-1 transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Task Item List with Status Marks & Delete */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {taskList.map((task) => (
                <div 
                  key={task.id}
                  className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start justify-between gap-2 hover:border-slate-700 transition"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* Clickable Status Badge */}
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="cursor-pointer hover:opacity-80 transition"
                        title="Click to toggle status (Pending -> Running -> Completed)"
                      >
                        {task.status === 'completed' && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                        {task.status === 'running' && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Active
                          </span>
                        )}
                        {task.status === 'self_healing' && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Healing
                          </span>
                        )}
                        {task.status === 'pending' && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono truncate">{task.agent}</span>
                    </div>

                    <p className="text-xs font-medium text-white truncate">{task.label}</p>
                  </div>

                  {/* Delete Task Button */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition shrink-0"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Task Manager Footer Summary */}
            <div className="p-2.5 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Total: {taskList.length}</span>
              <span className="text-emerald-400">Done: {taskList.filter(t => t.status === 'completed').length}</span>
              <span className="text-slate-400">Pending: {taskList.filter(t => t.status === 'pending').length}</span>
            </div>

          </div>
        )}

        {/* Right Side: Output Viewer & Inspector Panel */}
        <div className="w-88 bg-[#0F172A] border-l border-slate-800 flex flex-col h-full overflow-hidden">
          
          {/* Panel Tab Header */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-2 gap-1 text-xs">
            <button
              onClick={() => setActiveArtifactTab('code')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${activeArtifactTab === 'code' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>

            <button
              onClick={() => setActiveArtifactTab('logs')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${activeArtifactTab === 'logs' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Logs</span>
            </button>

            <button
              onClick={() => setActiveArtifactTab('inspector')}
              className={`flex-1 py-1.5 px-2 rounded-md font-semibold flex items-center justify-center gap-1.5 transition ${activeArtifactTab === 'inspector' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs">
            
            {/* Tab 1: Code Viewer */}
            {activeArtifactTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-white">Synthesized Python Script</span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsEditingCode(!isEditingCode)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                      title={isEditingCode ? "Lock Code" : "Edit Code"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded flex items-center gap-1 text-[10px]"
                      title="Copy code"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handleDownloadCode}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                      title="Download script .py"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isEditingCode ? (
                  <textarea
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="w-full h-80 p-3 bg-slate-950 border border-cyan-500/50 rounded-lg text-cyan-300 font-mono text-xs focus:outline-none"
                  />
                ) : (
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 overflow-x-auto leading-relaxed">
                    {customCode || (dagState?.artifacts?.find(a => a.type === 'code')?.content) || '# No synthesized code artifact yet.'}
                  </pre>
                )}
              </div>
            )}

            {/* Tab 2: Logs Viewer */}
            {activeArtifactTab === 'logs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-white">Execution Stream Logs</span>
                  <span className="text-[10px] text-cyan-400">Live WebSockets</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-slate-300 max-h-[500px] overflow-y-auto">
                  {dagState?.execution_logs?.length ? (
                    dagState.execution_logs.map((log, idx) => (
                      <p key={idx} className="text-slate-400 border-b border-slate-900 pb-1">{log}</p>
                    ))
                  ) : (
                    <p className="text-slate-600 italic">No logs recorded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Node Inspector */}
            {activeArtifactTab === 'inspector' && (
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm">Node Details Inspector</h4>
                
                {selectedNode ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                    <div>
                      <span className="text-slate-500">Label:</span> <strong className="text-white">{selectedNode.label}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Agent:</span> <span className="text-cyan-400">{selectedNode.agent_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span> <span className="uppercase text-amber-400 font-bold">{selectedNode.status}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Description:</span>
                      <p className="text-slate-400 text-[11px] mt-1">{selectedNode.description}</p>
                    </div>

                    {selectedNode.stdout && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-emerald-400">STDOUT:</span>
                        <pre className="p-2 bg-black rounded text-[10px] text-slate-300 mt-1 whitespace-pre-wrap">{selectedNode.stdout}</pre>
                      </div>
                    )}

                    {selectedNode.stderr && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-red-400">STDERR:</span>
                        <pre className="p-2 bg-black rounded text-[10px] text-red-300 mt-1 whitespace-pre-wrap">{selectedNode.stderr}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Click any node on the graph canvas to inspect runtime stdout/stderr logs.</p>
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
