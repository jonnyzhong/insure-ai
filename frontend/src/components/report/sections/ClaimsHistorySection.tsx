import { FileWarning, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ClaimRecord } from "@/types";

interface Props {
  claims: ClaimRecord[];
}

const CLAIM_STATUS_COLORS: Record<string, string> = {
  Paid: "#22c55e",
  Approved: "#3b82f6",
  Pending: "#eab308",
  "Under Review": "#f97316",
  Rejected: "#ef4444",
};

export function ClaimsHistorySection({ claims }: Props) {
  if (claims.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-indigo-500" />
            Claims History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
            <p className="text-sm font-medium">No Claims Filed</p>
            <p className="text-xs text-muted-foreground">This customer has a clean claims record.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Chart data: claims by status
  const statusCounts: Record<string, { count: number; totalAmount: number }> = {};
  for (const c of claims) {
    if (!statusCounts[c.status]) statusCounts[c.status] = { count: 0, totalAmount: 0 };
    statusCounts[c.status].count++;
    statusCounts[c.status].totalAmount += c.amount;
  }
  const chartData = Object.entries(statusCounts).map(([status, data]) => ({
    status,
    amount: data.totalAmount,
    count: data.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-indigo-500" />
          Claims History ({claims.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Claims chart */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Claims Amount by Status (SGD)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={CLAIM_STATUS_COLORS[entry.status] || "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Separator />

        {/* Claims table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-2 text-left font-medium text-xs">Claim ID</th>
                <th className="py-2 text-left font-medium text-xs">Date</th>
                <th className="py-2 text-left font-medium text-xs">Policy</th>
                <th className="py-2 text-right font-medium text-xs">Amount</th>
                <th className="py-2 text-left font-medium text-xs">Status</th>
                <th className="py-2 text-left font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claim_id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{claim.claim_id}</td>
                  <td className="py-2 text-xs">{claim.date}</td>
                  <td className="py-2 font-mono text-xs">{claim.associated_policy}</td>
                  <td className="py-2 text-right text-xs font-medium">${claim.amount.toFixed(2)}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        claim.status === "Paid" || claim.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : claim.status === "Rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                    {claim.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
