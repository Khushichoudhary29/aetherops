import React, { useState } from 'react';
import { Network, Activity, ShieldAlert, Sparkles, User, Github } from 'lucide-react';
import Dashboard1_DagCanvas from './components/Dashboard1_DagCanvas';
import Dashboard2_Placeholder from './components/Dashboard2_Placeholder';
import Dashboard3_Placeholder from './components/Dashboard3_Placeholder';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard1');

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex flex-col font-sans">
      
      {/* Top Application Header Navigation Bar */}
      <header className="h-16 bg-cardBg border-b border-panelBorder flex items-center justify-between px-6 shrink-0 z-20">
        
        {/* Brand & Academic Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
              AETHEROPS
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono font-normal">v1.0.0</span>
            </h1>
            <p className="text-[10px] text-gray-400">COER University B.Tech CSE Project • Supervisor: Ms. Nidhi Rana</p>
          </div>
        </div>

        {/* Dashboard View Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
          
          {/* Dashboard 1 - Member 1 (Khushi) */}
          <button
            onClick={() => setActiveTab('dashboard1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard1'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Dashboard 1: DAG Canvas</span>
            <span className="text-[9px] bg-cyan-900/60 text-cyan-200 px-1.5 py-0.5 rounded font-mono">Khushi</span>
          </button>

          {/* Dashboard 2 - Member 2 (Pragya) */}
          <button
            onClick={() => setActiveTab('dashboard2')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard2'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard 2: AgentOps Telemetry</span>
            <span className="text-[9px] bg-purple-900/60 text-purple-200 px-1.5 py-0.5 rounded font-mono">Pragya</span>
          </button>

          {/* Dashboard 3 - Member 3 (Riya) */}
          <button
            onClick={() => setActiveTab('dashboard3')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard3'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Dashboard 3: Security & HITL</span>
            <span className="text-[9px] bg-red-900/60 text-red-200 px-1.5 py-0.5 rounded font-mono">Riya</span>
          </button>

        </nav>

        {/* User / Team Badge */}
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <div className="flex items-center space-x-1.5 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-medium">Khushi Choudhary (Member 1)</span>
          </div>
        </div>

      </header>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'dashboard1' && <Dashboard1_DagCanvas />}
        {activeTab === 'dashboard2' && <Dashboard2_Placeholder />}
        {activeTab === 'dashboard3' && <Dashboard3_Placeholder />}
      </main>

    </div>
  );
}
