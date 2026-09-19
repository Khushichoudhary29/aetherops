import React from 'react';
import { Activity, Terminal, Cpu, DollarSign, UserCheck, ShieldAlert } from 'lucide-react';

export default function Dashboard2_Placeholder() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-cardBg border border-panelBorder rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard 2: AgentOps Telemetry Station</h2>
            <p className="text-xs text-gray-400">Assigned Module to: <span className="text-purple-400 font-semibold">Pragya Singhal (Member 2 - 243025178)</span></p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          This integration station is designated for Member 2 (Pragya Singhal) to build real-time system observability tools using <code className="text-cyan-400 bg-gray-900 px-2 py-0.5 rounded font-mono">Recharts</code> for token burn rates, per-node execution latency, error recovery counts, and <code className="text-cyan-400 bg-gray-900 px-2 py-0.5 rounded font-mono">xterm.js</code> for terminal streaming.
        </p>

        {/* Mock Metric Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span>Token Consumption</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">2,280 <span className="text-xs text-gray-500">tok</span></p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span>Estimated API Cost</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">$0.0228 <span className="text-xs text-gray-500">USD</span></p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span>Avg Node Latency</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">912 <span className="text-xs text-gray-500">ms</span></p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span>Self-Healing Recovery</span>
              <UserCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">100% <span className="text-xs text-emerald-400">Stable</span></p>
          </div>
        </div>

        {/* Terminal Placeholder */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 font-mono text-xs text-gray-400 space-y-1">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2 text-gray-500">
            <span className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>xterm.js Execution Stream Slot (Pragya)</span>
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Ready for Integration</span>
          </div>
          <p className="text-emerald-400">[SYSTEM]: WebSocket synced to FastAPI backend engine (ws://localhost:8000/ws/dag)</p>
          <p className="text-gray-400">[AGENT-LOG]: Telemetry event hook initialized for Member 2 metrics stream.</p>
          <p className="text-gray-500">// Member 2 will connect live Recharts analytics & xterm log terminal here.</p>
        </div>
      </div>
    </div>
  );
}
