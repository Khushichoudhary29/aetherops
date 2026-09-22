import React from 'react';
import { ShieldAlert, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Dashboard3_Placeholder() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-cardBg border border-panelBorder rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Human-in-the-Loop Security Terminal</h2>
            <p className="text-xs text-gray-400">Operational safety governance and manual approval breakpoints</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          This governance dashboard enforces Human-in-the-Loop (HITL) approval breakpoints, intercepts restricted execution calls (such as file modifications or raw network requests), and provides prompt injection override controls.
        </p>

        {/* Security Policy Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-400 text-xs font-bold mb-2">
              <Lock className="w-4 h-4" />
              <span>Restricted Commands Policy</span>
            </div>
            <p className="text-xs text-gray-400">Blocks <code className="text-amber-300">rm -rf</code>, <code className="text-amber-300">os.system</code>, and raw socket operations.</p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>HITL Breakpoint Triggers</span>
            </div>
            <p className="text-xs text-gray-400">Auto-pauses state machine execution when restricted calls are flagged.</p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Human Approval Override</span>
            </div>
            <p className="text-xs text-gray-400">Allows human evaluators to Approve, Reject, or Inject prompt modifications mid-flight.</p>
          </div>
        </div>

        {/* Security Alert Console */}
        <div className="bg-gray-950 border border-red-900/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-gray-400 text-xs">
            <span className="font-semibold text-white">HITL Governance Console</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Active Guardrails</span>
          </div>

          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>HITL Interrupt Gate: Guardrail Monitoring Active</span>
              </p>
              <p className="text-xs text-gray-400">State graph automatically pauses when restricted operations are flagged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
