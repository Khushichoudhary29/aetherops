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
  X
} from 'lucide-react';

// Custom Node Component supporting Light & Dark Themes
const CustomAgentNode = ({ data }) => {
  const isDark = data.isDarkMode;

  const getStatusStyle = () => {
    switch (data.status) {
      case 'running':
        return isDark 
          ? 'border-amber-500 bg-amber-950/40 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse'
          : 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_4px_15px_rgba(245,158,11,0.25)] animate-pulse';
      case 'self_healing':
        return isDark
          ? 'border-orange-500 bg-orange-950/40 text-orange-300 shadow-[0_0_20px_rgba(234,88,12,0.4)] animate-pulse'
          : 'border-orange-500 bg-orange-50 text-orange-900 shadow-[0_4px_15px_rgba(234,88,12,0.25)] animate-pulse';
      case 'completed':
        return isDark
          ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300'
          : 'border-emerald-500/80 bg-emerald-50 text-emerald-900 shadow-sm';
      case 'hitl_paused':
        return isDark
          ? 'border-purple-500 bg-purple-950/30 text-purple-300'
          : 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm';
      case 'failed':
        return isDark
          ? 'border-red-500 bg-red-950/30 text-red-300'
          : 'border-red-500 bg-red-50 text-red-900 shadow-sm';
      default:
        return isDark
          ? 'border-[#2D3342] bg-[#1C1F28] text-gray-300 shadow-sm'
          : 'border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300';
    }
  };

  const getStatusBadge = () => {
    switch (data.status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
            <Loader2 className="w-3 h-3 animate-spin" /> RUNNING
          </span>
        );
      case 'self_healing':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-orange-500/20 text-orange-600 px-2 py-0.5 rounded-full font-semibold border border-orange-500/30">
            <AlertTriangle className="w-3 h-3 animate-bounce" /> HEALING
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> DONE
          </span>
        );
      default:
        return (
          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
            isDark ? 'bg-[#272B36] text-gray-400 border-[#2D3342]' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className={`w-64 p-4 rounded-2xl border-2 transition-all duration-300 ${getStatusStyle()}`}>
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3.5 !h-3.5" />
      
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
          {data.agent_type}
        </span>
        {getStatusBadge()}
      </div>

      <div className={`text-sm font-bold mb-1 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="truncate">{data.label}</span>
      </div>

      <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
        {data.description}
      </p>

      {data.latency_ms > 0 && (
        <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
          isDark ? 'border-[#2D3342] text-gray-400' : 'border-slate-200 text-slate-500'
        }`}>
          <span>Latency: {data.latency_ms}ms</span>
          <span>{data.token_usage || 0} tokens</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3.5 !h-3.5" />
    </div>
  );
};

const nodeTypes = {
  agentNode: CustomAgentNode,
};

export default function Dashboard1_DagCanvas({ isDarkMode = false }) {
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

  // Map task items into React Flow graph layout
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
      position: { x: 250, y: 30 + idx * 160 },
      data: { ...item, isDarkMode },
    }));

    const flowEdges = [];
    for (let i = 0; i < listToRender.length - 1; i++) {
      flowEdges.push({
        id: `edge-${i}`,
        source: listToRender[i].id,
        target: listToRender[i + 1].id,
        animated: listToRender[i].status === 'running',
        style: { stroke: isDarkMode ? '#F59E0B' : '#D97706', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isDarkMode ? '#F59E0B' : '#D97706' }
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
  }, [setNodes, setEdges, customCode, taskList, isDarkMode]);

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

  // Initial load graph render & re-render on dark mode change
  useEffect(() => {
    updateReactFlowGraph(dagState, taskList);
  }, [isDarkMode]);

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

  // Step execution
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

  // Auto-run
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

  // Add Task
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

  // Delete Task
  const handleDeleteTask = (taskIdToDelete) => {
    const updated = taskList.filter(t => t.id !== taskIdToDelete);
    setTaskList(updated);
    updateReactFlowGraph(dagState, updated);
  };

  // Toggle Task Status
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
    <div className={`flex flex-col h-[calc(100vh-4rem)] overflow-hidden font-sans transition-colors duration-300 ${
      isDarkMode ? 'bg-[#14161D] text-gray-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      
      {/* Top Toolbar Navigation Bar */}
      <div className={`p-3.5 border-b flex flex-wrap items-center justify-between gap-3 shadow-sm z-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1C1F28] border-[#2D3342]' : 'bg-white border-slate-200'
      }`}>
        
        {/* Goal Ingestion Search-Command Bar */}
        <div className="flex items-center gap-2 flex-1 min-w-[320px]">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            placeholder="Enter goal prompt instruction..."
            className={`flex-1 border rounded-xl px-4 py-2 text-xs font-sans transition-all focus:outline-none ${
              isDarkMode 
                ? 'bg-[#14161D] border-[#2D3342] text-white focus:border-amber-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
            }`}
          />
          <button
            onClick={handleCreateDag}
            disabled={isExecuting}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition shadow-sm ${
              showTaskManager 
                ? 'bg-amber-500/20 text-amber-600 border-amber-500/40' 
                : isDarkMode ? 'bg-[#14161D] text-gray-400 border-[#2D3342] hover:text-white' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Task Manager Panel"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Task Manager ({taskList.length})</span>
          </button>

          <button
            onClick={handleStepNode}
            disabled={!taskId || isExecuting}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
              isDarkMode ? 'bg-[#272B36] text-gray-200 border-[#2D3342] hover:bg-[#323745]' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-amber-500" />
            <span>Step</span>
          </button>

          <button
            onClick={handleAutoRun}
            disabled={!taskId || isExecuting}
            className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <FastForward className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auto-Run</span>
          </button>

          <button
            onClick={handleTriggerSelfHealingDemo}
            disabled={isSelfHealingDemo}
            className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <Bug className="w-3.5 h-3.5 text-orange-500" />
            <span>Self-Healing Demo</span>
          </button>

          <button
            onClick={handleResetCanvas}
            className={`p-2 rounded-xl border transition ${
              isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-gray-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title="Reset Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: React Flow Canvas with Mouse Scrolling & Panning Enabled */}
        <div className={`flex-1 relative transition-colors duration-300 ${isDarkMode ? 'bg-[#14161D]' : 'bg-[#F8FAFC]'}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            panOnScroll={true}
            panOnDrag={true}
            zoomOnScroll={false}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            fitView
            className="w-full h-full"
          >
            <Background color={isDarkMode ? '#272B36' : '#CBD5E1'} gap={24} size={1} />
            <Controls className={isDarkMode ? '!bg-[#1C1F28] !border-[#2D3342]' : '!bg-white !border-slate-200'} />
            <MiniMap 
              nodeColor={(n) => n.data?.status === 'completed' ? '#10B981' : n.data?.status === 'running' ? '#F59E0B' : '#94A3B8'}
              maskColor={isDarkMode ? 'rgba(20, 22, 29, 0.7)' : 'rgba(248, 250, 252, 0.7)'}
              className={isDarkMode ? '!bg-[#1C1F28] !border-[#2D3342]' : '!bg-white !border-slate-200'}
            />
          </ReactFlow>

          {/* Floating Metrics Status Bar */}
          {dagState && (
            <div className={`absolute bottom-4 left-4 z-10 backdrop-blur border rounded-xl p-3 text-xs flex items-center gap-4 shadow-xl font-mono ${
              isDarkMode ? 'bg-[#1C1F28]/90 border-[#2D3342] text-gray-300' : 'bg-white/90 border-slate-200 text-slate-700'
            }`}>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                Task: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{dagState.task_id}</strong>
              </span>
              <span>Tokens: <strong className="text-amber-600">{dagState.total_tokens}</strong></span>
              <span>Cost: <strong className="text-emerald-600">${dagState.total_cost}</strong></span>
            </div>
          )}
        </div>

        {/* EMBEDDED MINI TASK MANAGER DRAWER */}
        {showTaskManager && (
          <div className={`w-80 border-r flex flex-col h-full shadow-xl z-10 backdrop-blur-md transition-colors duration-300 ${
            isDarkMode ? 'bg-[#1C1F28]/95 border-[#2D3342]' : 'bg-white/95 border-slate-200'
          }`}>
            
            {/* Header */}
            <div className={`p-3 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-[#14161D]/80 border-[#2D3342]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2">
                <ListTodo className="w-4 h-4 text-amber-500" />
                <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Task Manager</h3>
              </div>
              <button 
                onClick={() => setShowTaskManager(false)}
                className={`p-1 rounded transition ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#272B36]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Task Input Form */}
            <div className={`p-3 border-b space-y-2 ${isDarkMode ? 'border-[#2D3342] bg-[#14161D]/40' : 'border-slate-200 bg-slate-50/50'}`}>
              <input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Add subtask description..."
                className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none ${
                  isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-white focus:border-amber-500' : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500'
                }`}
              />
              <div className="flex items-center gap-2">
                <select
                  value={newTaskAgent}
                  onChange={(e) => setNewTaskAgent(e.target.value)}
                  className={`flex-1 border rounded-lg px-2 py-1 text-[11px] focus:outline-none ${
                    isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-gray-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="Supervisor Agent">Supervisor Agent</option>
                  <option value="Coder Agent">Coder Agent</option>
                  <option value="Security Auditor">Security Auditor</option>
                  <option value="Sandbox Runner">Sandbox Runner</option>
                  <option value="Reviewer Agent">Reviewer Agent</option>
                </select>
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Task Item List */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 font-sans">
              {taskList.map((task) => (
                <div 
                  key={task.id}
                  className={`p-3 border rounded-xl flex items-start justify-between gap-2 transition ${
                    isDarkMode 
                      ? 'bg-[#14161D]/80 border-[#2D3342] hover:border-[#3B4254]' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="cursor-pointer hover:opacity-80 transition"
                        title="Click to toggle status (Pending -> Active -> Done)"
                      >
                        {task.status === 'completed' && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                        {task.status === 'running' && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-amber-500/20">
                            <Loader2 className="w-3 h-3 animate-spin" /> Active
                          </span>
                        )}
                        {task.status === 'self_healing' && (
                          <span className="text-[10px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-orange-500/20">
                            <AlertTriangle className="w-3 h-3" /> Healing
                          </span>
                        )}
                        {task.status === 'pending' && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border ${
                            isDarkMode ? 'bg-[#272B36] text-gray-400 border-[#2D3342]' : 'bg-slate-200 text-slate-600 border-slate-300'
                          }`}>
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </button>
                      <span className="text-[10px] text-gray-400 font-mono truncate">{task.agent}</span>
                    </div>

                    <p className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.label}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={`p-1 rounded transition shrink-0 ${
                      isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-[#272B36]' : 'text-slate-400 hover:text-red-600 hover:bg-slate-200'
                    }`}
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className={`p-3 border-t text-[11px] flex items-center justify-between font-mono ${
              isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <span>Total: {taskList.length}</span>
              <span className="text-emerald-600 font-semibold">Done: {taskList.filter(t => t.status === 'completed').length}</span>
              <span className="text-amber-600 font-semibold">Pending: {taskList.filter(t => t.status === 'pending').length}</span>
            </div>

          </div>
        )}

        {/* Right Side: Output Viewer & Inspector Panel */}
        <div className={`w-88 border-l flex flex-col h-full overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1C1F28] border-[#2D3342]' : 'bg-white border-slate-200'
        }`}>
          
          {/* Panel Tab Header */}
          <div className={`flex items-center border-b p-2 gap-1 text-xs ${
            isDarkMode ? 'bg-[#14161D]/80 border-[#2D3342]' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveArtifactTab('code')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                activeArtifactTab === 'code' 
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30 font-bold' 
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>

            <button
              onClick={() => setActiveArtifactTab('logs')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                activeArtifactTab === 'logs' 
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30 font-bold' 
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Logs</span>
            </button>

            <button
              onClick={() => setActiveArtifactTab('inspector')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                activeArtifactTab === 'inspector' 
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30 font-bold' 
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
            
            {/* Tab 1: Code Viewer */}
            {activeArtifactTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-400">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Synthesized Python Script</span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsEditingCode(!isEditingCode)}
                      className={`p-1 rounded transition ${isDarkMode ? 'hover:bg-[#272B36] text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                      title={isEditingCode ? "Lock Code" : "Edit Code"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className={`p-1 rounded flex items-center gap-1 text-[10px] transition ${isDarkMode ? 'hover:bg-[#272B36] text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                      title="Copy code"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handleDownloadCode}
                      className={`p-1 rounded transition ${isDarkMode ? 'hover:bg-[#272B36] text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
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
                    className={`w-full h-80 p-3 border rounded-xl font-mono text-xs focus:outline-none ${
                      isDarkMode ? 'bg-[#14161D] border-amber-500/50 text-amber-300' : 'bg-slate-900 border-amber-500/50 text-amber-400'
                    }`}
                  />
                ) : (
                  <pre className={`p-3.5 border rounded-xl overflow-x-auto leading-relaxed font-mono ${
                    isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-amber-300' : 'bg-slate-900 border-slate-800 text-amber-400'
                  }`}>
                    {customCode || (dagState?.artifacts?.find(a => a.type === 'code')?.content) || '# No synthesized code artifact yet.'}
                  </pre>
                )}
              </div>
            )}

            {/* Tab 2: Logs Viewer */}
            {activeArtifactTab === 'logs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-400">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Execution Stream Logs</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Live WebSockets</span>
                </div>

                <div className={`p-3.5 border rounded-xl space-y-2 max-h-[500px] overflow-y-auto ${
                  isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-gray-300' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  {dagState?.execution_logs?.length ? (
                    dagState.execution_logs.map((log, idx) => (
                      <p key={idx} className="text-gray-400 border-b border-gray-800/60 pb-1">{log}</p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No logs recorded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Node Inspector */}
            {activeArtifactTab === 'inspector' && (
              <div className="space-y-4">
                <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Node Details Inspector</h4>
                
                {selectedNode ? (
                  <div className={`border rounded-xl p-3.5 space-y-2 ${
                    isDarkMode ? 'bg-[#14161D] border-[#2D3342]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-gray-400">Label:</span> <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{selectedNode.label}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Agent:</span> <span className="text-amber-600 font-semibold">{selectedNode.agent_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span> <span className="uppercase text-amber-600 font-bold">{selectedNode.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{selectedNode.description}</p>
                    </div>

                    {selectedNode.stdout && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-[#2D3342]">
                        <span className="text-emerald-600 font-bold">STDOUT:</span>
                        <pre className="p-2 bg-slate-900 text-slate-200 rounded-lg text-[10px] mt-1 whitespace-pre-wrap">{selectedNode.stdout}</pre>
                      </div>
                    )}

                    {selectedNode.stderr && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-[#2D3342]">
                        <span className="text-red-500 font-bold">STDERR:</span>
                        <pre className="p-2 bg-slate-900 text-red-300 rounded-lg text-[10px] mt-1 whitespace-pre-wrap">{selectedNode.stderr}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Info className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                    <p className="text-xs">Click any node on the graph canvas to inspect runtime stdout/stderr logs.</p>
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
