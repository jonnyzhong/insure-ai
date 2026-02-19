import client from "./client";
import type { ExecutiveReport } from "@/types";

export async function generateReport(
  sessionId: string
): Promise<ExecutiveReport> {
  const { data } = await client.post<ExecutiveReport>("/api/report", {
    session_id: sessionId,
  });
  return data;
}
