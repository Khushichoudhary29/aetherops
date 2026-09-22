import React from 'react';

export default function Dashboard2_Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-darkBg text-gray-400 p-6">
      <div className="bg-cardBg border border-panelBorder rounded-2xl p-10 max-w-md text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg">
          02
        </div>
        <h2 className="text-xl font-bold text-white mb-2">AgentOps Telemetry</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          This dashboard view is reserved for telemetry & metrics integration.
        </p>
      </div>
    </div>
  );
}
