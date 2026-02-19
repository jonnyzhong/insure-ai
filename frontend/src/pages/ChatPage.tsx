import { useCallback } from "react";
import { Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkipLink } from "@/components/common/SkipLink";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickActions } from "@/components/chat/QuickActions";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useUIStore } from "@/stores/uiStore";
import { sendMessage } from "@/api/chatApi";
import { generateReport } from "@/api/reportApi";
import { useReportStore } from "@/stores/reportStore";
import { ReportDialog } from "@/components/report/ReportDialog";
import type { Message } from "@/types";

const REPORT_TRIGGERS = ["generate report", "executive summary", "show report", "show my report"];

export function ChatPage() {
  const { isAuthenticated, sessionId } = useAuthStore();
  const { addMessage, setTyping, isTyping, messages } = useChatStore();
  const { setSidebarOpen } = useUIStore();

  const handleSend = useCallback(
    async (text: string) => {
      if (!sessionId) return;

      // Check for report trigger
      const normalized = text.toLowerCase().trim();
      if (REPORT_TRIGGERS.some((t) => normalized.includes(t))) {
        addMessage({
          id: crypto.randomUUID(),
          role: "user",
          content: text,
          timestamp: new Date(),
        });
        const state = useReportStore.getState();
        // Reuse cached report if already generated this session
        if (state.report) {
          addMessage({
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Opening your Executive Summary Report.",
            timestamp: new Date(),
          });
          state.setOpen(true);
          return;
        }
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Generating your Executive Summary Report. This may take a moment...",
          timestamp: new Date(),
        });
        state.setOpen(true);
        state.setLoading(true);
        try {
          const report = await generateReport(sessionId);
          state.setReport(report);
        } catch {
          state.setError("Failed to generate report. Please try again.");
        }
        return;
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      addMessage(userMsg);
      setTyping(true);

      try {
        const res = await sendMessage(sessionId, text);

        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: res.blocked ? "guardrail" : "assistant",
          content: res.ai_message,
          agentName: res.agent_name,
          toolCalls: res.tool_calls,
          timestamp: new Date(),
        };
        addMessage(aiMsg);
      } catch {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Connection error. Please check the backend server and try again.",
          timestamp: new Date(),
        });
      } finally {
        setTyping(false);
      }
    },
    [sessionId, addMessage, setTyping]
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SkipLink />
      <ChatSidebar onQuickAction={handleSend} />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-semibold">Insurance Assistant</h1>
          </div>
        </header>

        {/* Main chat area */}
        <main id="main-content" className="flex flex-1 flex-col overflow-hidden">
          <ChatContainer />

          {/* Mobile quick actions */}
          {messages.length === 0 && (
            <div className="border-t border-border px-4 py-3 lg:hidden">
              <QuickActions onAction={handleSend} />
            </div>
          )}

          <ChatInput onSend={handleSend} disabled={isTyping} />
        </main>
      </div>

      <ReportDialog />
    </div>
  );
}
