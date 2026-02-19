import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExecutiveSummary } from "@/types";

interface Props {
  summary: ExecutiveSummary;
}

export function ExecutiveSummarySection({ summary }: Props) {
  const isActive = summary.account_status === "Active";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Executive Summary
          </CardTitle>
          <Badge className={isActive
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }>
            {isActive ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            {summary.account_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary.portfolio_narrative}
        </p>

        <div>
          <h4 className="text-sm font-semibold mb-2">Key Findings</h4>
          <ul className="space-y-1.5">
            {summary.key_findings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-indigo-500" />
                {finding}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
