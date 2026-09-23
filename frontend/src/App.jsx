import React, { useState } from 'react';
import { Network, Activity, ShieldAlert, Sparkles, Sun, Moon } from 'lucide-react';
import Dashboard1_DagCanvas from './components/Dashboard1_DagCanvas';
import Dashboard2_Placeholder from './components/Dashboard2_Placeholder';
import Dashboard3_Placeholder from './components/Dashboard3_Placeholder';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard1');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to clean, aesthetic Light theme!

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark-mode bg-[#14161D] text-gray-100' : 'light-mode bg-[#F8FAFC] text-slate-800'}`}>
      
      {/* Top Application Header Navigation Bar */}
      <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-20 shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1C1F28] border-[#2D3342]' : 'bg-white border-slate-200'
      }`}>
        
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-xl shadow-md text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-extrabold tracking-wider flex items-center gap-2 font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              AETHEROPS
              <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-mono font-medium border border-amber-500/20">v1.0.0</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-sans tracking-wide">Stateful Multi-Agent Control Center</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={`flex items-center space-x-1 p-1 rounded-xl border ${
          isDarkMode ? 'bg-[#14161D] border-[#2D3342]' : 'bg-slate-100 border-slate-200'
        }`}>
          
          <button
            onClick={() => setActiveTab('dashboard1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'dashboard1'
                ? 'bg-amber-600 text-white shadow-md'
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#272B36]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
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
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#272B36]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
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
                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#272B36]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Security & HITL</span>
          </button>

        </nav>

        {/* Right Header Controls: Light/Dark Theme Switcher & System Status */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 font-medium transition shadow-sm ${
              isDarkMode 
                ? 'bg-[#14161D] border-[#2D3342] text-amber-400 hover:bg-[#272B36]' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span className="text-[11px] font-mono">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* System Status Pill */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${
            isDarkMode ? 'bg-[#14161D] border-[#2D3342] text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium font-mono text-[11px]">System Online</span>
          </div>
        </div>

      </header>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'dashboard1' && <Dashboard1_DagCanvas isDarkMode={isDarkMode} />}
        {activeTab === 'dashboard2' && <Dashboard2_Placeholder isDarkMode={isDarkMode} />}
        {activeTab === 'dashboard3' && <Dashboard3_Placeholder isDarkMode={isDarkMode} />}
      </main>

    </div>
  );
}
