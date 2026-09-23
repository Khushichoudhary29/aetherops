import React, { useState } from 'react';
import { Network, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import Dashboard1_DagCanvas from './components/Dashboard1_DagCanvas';
import Dashboard2_Placeholder from './components/Dashboard2_Placeholder';
import Dashboard3_Placeholder from './components/Dashboard3_Placeholder';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard1');

  return (
    <div className="min-h-screen bg-[#14161D] text-gray-100 flex flex-col font-sans">
      
      {/* Top Application Header Navigation Bar - Warm Industrial Minimal */}
      <header className="h-16 bg-[#1C1F28] border-b border-[#2D3342] flex items-center justify-between px-6 shrink-0 z-20 shadow-md">
        
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-xl shadow-md text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-wider flex items-center gap-2 font-mono">
              AETHEROPS
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono font-medium border border-amber-500/30">v1.0.0</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-sans tracking-wide">Stateful Multi-Agent Operations Harness</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#14161D] p-1 rounded-xl border border-[#2D3342]">
          
          <button
            onClick={() => setActiveTab('dashboard1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard1'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#272B36]'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>DAG Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard2')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard2'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#272B36]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>AgentOps Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard3')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard3'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#272B36]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Security & HITL</span>
          </button>

        </nav>

        {/* System Status Badge */}
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <div className="flex items-center space-x-2 bg-[#14161D] px-3 py-1.5 rounded-lg border border-[#2D3342]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-gray-300 font-medium font-mono text-[11px]">System Online</span>
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
