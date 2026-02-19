import { Lock, ShieldCheck, Zap } from "lucide-react";

const items = [
  { icon: Lock, label: "Bank-grade security" },
  { icon: ShieldCheck, label: "MAS compliant" },
  { icon: Zap, label: "Instant responses" },
];

export function TrustBar() {
  return (
    <section id="trust" className="border-y border-border bg-muted/30 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-12">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
