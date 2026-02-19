import { Badge } from "@/components/ui/badge";
import type { AgentType } from "@/types";

const agentStyles: Record<string, string> = {
  "Policy Agent": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "Auto Specialist": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "Claims Agent": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "Billing Agent": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "FAQ Agent": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Customer Agent": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  General: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

interface Props {
  agent: AgentType;
}

export function AgentBadge({ agent }: Props) {
  return (
    <Badge
      variant="secondary"
      className={`text-[11px] px-2 py-0 font-medium ${agentStyles[agent] ?? agentStyles.General}`}
      aria-label={`Handled by ${agent}`}
    >
      {agent}
    </Badge>
  );
}
