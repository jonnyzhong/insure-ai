import { useState } from "react";
import { ChevronDown, ChevronRight, Terminal } from "lucide-react";
import type { ToolCall } from "@/types";

interface Props {
  toolCalls: ToolCall[];
  agentName?: string | null;
}

export function AgentTracePanel({ toolCalls, agentName }: Props) {
  const [open, setOpen] = useState(false);

  if (!toolCalls.length) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Terminal className="h-3 w-3" />
        <span>Details</span>
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-slate-900 p-3 text-xs font-mono text-slate-300">
          {agentName && (
            <div className="mb-2 text-emerald-400">Route: {agentName}</div>
          )}
          {toolCalls.map((tc, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <span className="text-sky-400">Tool:</span> {tc.name}
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-slate-400">
                {JSON.stringify(tc.args, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
