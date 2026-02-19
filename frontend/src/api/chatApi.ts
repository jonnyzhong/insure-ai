import client from "./client";
import type { ChatResponse } from "@/types";

export async function sendMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  const { data } = await client.post<ChatResponse>("/api/chat", {
    session_id: sessionId,
    message,
  });
  return data;
}

export async function clearHistory(sessionId: string): Promise<void> {
  await client.delete("/api/chat/history", { params: { session_id: sessionId } });
}
