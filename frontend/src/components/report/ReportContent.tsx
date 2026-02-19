import { ExecutiveSummarySection } from "./sections/ExecutiveSummarySection";
import { CustomerProfileSection } from "./sections/CustomerProfileSection";
import { PolicyPortfolioSection } from "./sections/PolicyPortfolioSection";
import { ClaimsHistorySection } from "./sections/ClaimsHistorySection";
import type { ExecutiveReport } from "@/types";

interface Props {
  report: ExecutiveReport;
}

export function ReportContent({ report }: Props) {
  return (
    <div className="space-y-6">
      <ExecutiveSummarySection summary={report.executive_summary} />
      <CustomerProfileSection profile={report.customer_profile} />
      <PolicyPortfolioSection policies={report.policy_portfolio} />
      <ClaimsHistorySection claims={report.claims_history} />
    </div>
  );
}
