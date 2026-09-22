import React from 'react';

export default function Dashboard3_Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-darkBg text-gray-400 p-6">
      <div className="bg-cardBg border border-panelBorder rounded-2xl p-10 max-w-md text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg">
          03
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Security & HITL</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          This dashboard view is reserved for security & human-in-the-loop guardrail integration.
        </p>
      </div>
    </div>
  );
}
