export interface User {
  displayName: string;
  email: string;
  policyType: string;
  customerId: string;
  age: number;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export type AgentType =
  | "Policy Agent"
  | "Claims Agent"
  | "Billing Agent"
  | "FAQ Agent"
  | "Auto Specialist"
  | "Customer Agent"
  | "General";

export interface Message {
  id: string;
  role: "user" | "assistant" | "guardrail";
  content: string;
  agentName?: AgentType | null;
  toolCalls?: ToolCall[];
  timestamp: Date;
}

export interface ChatResponse {
  ai_message: string;
  agent_name: AgentType | null;
  tool_calls: ToolCall[];
  blocked: boolean;
  block_message: string | null;
}

export interface LoginResponse {
  session_id: string;
  display_name: string;
  email: string;
  policy_type: string;
  customer_id: string;
}

// --- Executive Summary Report Types ---

export interface ReportMetadata {
  report_title: string;
  generation_date: string;
  customer_id: string;
}

export interface ExecutiveSummary {
  account_status: string;
  portfolio_narrative: string;
  key_findings: string[];
}

export interface CustomerAddress {
  full_address: string;
  region: string;
}

export interface CustomerProfile {
  name: string;
  nric: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: CustomerAddress;
}

export interface BillingRecord {
  bill_id: string;
  due_date: string;
  status: string;
}

export interface PolicyPremium {
  amount: number;
  currency: string;
  frequency: string;
}

export interface PolicyPortfolioItem {
  policy_id: string;
  type: string;
  status: string;
  start_date: string;
  premium: PolicyPremium;
  billing_history: BillingRecord[];
}

export interface ClaimRecord {
  claim_id: string;
  date: string;
  associated_policy: string;
  amount: number;
  status: string;
  description: string;
}

export interface ExecutiveReport {
  report_metadata: ReportMetadata;
  executive_summary: ExecutiveSummary;
  customer_profile: CustomerProfile;
  policy_portfolio: PolicyPortfolioItem[];
  claims_history: ClaimRecord[];
}
