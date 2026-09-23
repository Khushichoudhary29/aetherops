import React from 'react';

export default function Dashboard2_Placeholder({ isDarkMode }) {
  return (
    <div className={`flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#14161D] text-gray-400' : 'bg-[#F8FAFC] text-slate-500'
    }`}>
      <div className={`border rounded-2xl p-10 max-w-md text-center shadow-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1C1F28] border-[#2D3342]' : 'bg-white border-slate-200'
      }`}>
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg">
          02
        </div>
        <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AgentOps Telemetry</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          This dashboard view is reserved for telemetry & metrics integration.
        </p>
      </div>
    </div>
  );
}
