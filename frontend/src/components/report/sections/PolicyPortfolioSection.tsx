import { ShieldCheck } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PolicyPortfolioItem } from "@/types";

interface Props {
  policies: PolicyPortfolioItem[];
}

const STATUS_COLORS: Record<string, string> = {
  Paid: "#22c55e",
  Pending: "#eab308",
  Overdue: "#ef4444",
};

const POLICY_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0e7ff"];

export function PolicyPortfolioSection({ policies }: Props) {
  // Premium comparison data
  const premiumData = policies.map((p) => ({
    name: `${p.type} (${p.policy_id})`,
    premium: p.premium.amount,
    type: p.type,
  }));

  // Billing status aggregation
  const billingCounts: Record<string, number> = { Paid: 0, Pending: 0, Overdue: 0 };
  for (const p of policies) {
    for (const b of p.billing_history) {
      const status = b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase();
      if (status in billingCounts) billingCounts[status]++;
      else billingCounts["Pending"]++;
    }
  }
  const billingData = Object.entries(billingCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          Policy Portfolio ({policies.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Charts row */}
        {policies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Premium Bar Chart */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Premium Comparison (SGD)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={premiumData}>
                  <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Premium"]} />
                  <Bar dataKey="premium" radius={[4, 4, 0, 0]}>
                    {premiumData.map((_, i) => (
                      <Cell key={i} fill={POLICY_COLORS[i % POLICY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Billing Pie Chart */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Billing Status</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={billingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {billingData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <Separator />

        {/* Policy cards */}
        <div className="space-y-4">
          {policies.map((policy) => (
            <PolicyCard key={policy.policy_id} policy={policy} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PolicyCard({ policy }: { policy: PolicyPortfolioItem }) {
  const statusColor = policy.status === "Active"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : policy.status === "Cancelled"
    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{policy.type} — {policy.policy_id}</p>
          <p className="text-xs text-muted-foreground">
            Start: {policy.start_date} · {policy.premium.currency} {policy.premium.amount.toFixed(2)} / {policy.premium.frequency}
          </p>
        </div>
        <Badge className={statusColor}>{policy.status}</Badge>
      </div>

      {policy.billing_history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-1.5 text-left font-medium">Bill ID</th>
                <th className="py-1.5 text-left font-medium">Due Date</th>
                <th className="py-1.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {policy.billing_history.slice(0, 5).map((bill) => (
                <tr key={bill.bill_id} className="border-b last:border-0">
                  <td className="py-1.5 font-mono">{bill.bill_id}</td>
                  <td className="py-1.5">{bill.due_date}</td>
                  <td className="py-1.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        bill.status === "Paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : bill.status === "Overdue"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {policy.billing_history.length > 5 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{policy.billing_history.length - 5} more records
            </p>
          )}
        </div>
      )}
    </div>
  );
}
