import { ShieldAlert } from "lucide-react";

interface Props {
  message: string;
}

export function GuardrailNotice({ message }: Props) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50"
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
      <div>
        <p className="text-sm font-medium text-red-800 dark:text-red-300">{message}</p>
        <p className="mt-1 text-xs text-red-600/70 dark:text-red-400/70">
          Try asking about your own policies, claims, or billing instead.
        </p>
      </div>
    </div>
  );
}
