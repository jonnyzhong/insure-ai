import { FileText, FileWarning, Receipt, HelpCircle, Car, MessageSquare, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTopicsStore } from "@/stores/topicsStore";

const ICON_MAP: Record<string, LucideIcon> = {
  "My Policies": FileText,
  "File a Claim": FileWarning,
  "Billing History": Receipt,
  "What is NCD?": HelpCircle,
  "Vehicle Details": Car,
};

interface Props {
  onAction: (prompt: string) => void;
  variant?: "light" | "dark";
}

export function QuickActions({ onAction, variant = "light" }: Props) {
  const { topics } = useTopicsStore();

  const btnClass =
    variant === "dark"
      ? "h-8 gap-1.5 text-xs rounded-full border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white"
      : "h-8 gap-1.5 text-xs rounded-full";

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t) => {
        const Icon = ICON_MAP[t.label] || MessageSquare;
        return (
          <Button
            key={t.label}
            variant="outline"
            size="sm"
            className={btnClass}
            onClick={() => onAction(t.prompt)}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </Button>
        );
      })}
    </div>
  );
}
