import { LogOut, MessageSquarePlus, FileBarChart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { QuickActions } from "./QuickActions";
import { TopicSettingsDialog } from "./TopicSettingsDialog";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useUIStore } from "@/stores/uiStore";
import { clearHistory } from "@/api/chatApi";
import { generateReport } from "@/api/reportApi";
import { useReportStore } from "@/stores/reportStore";

interface Props {
  onQuickAction: (prompt: string) => void;
}

export function ChatSidebar({ onQuickAction }: Props) {
  const { user, sessionId, logout } = useAuthStore();
  const { clearMessages } = useChatStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();

  if (!user) return null;

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleNewConversation = async () => {
    if (sessionId) {
      await clearHistory(sessionId).catch(() => {});
    }
    clearMessages();
    useReportStore.getState().reset();
  };

  const handleGenerateReport = async () => {
    if (!sessionId) return;
    const state = useReportStore.getState();
    setSidebarOpen(false);
    // Reuse cached report if already generated this session
    if (state.report) {
      state.setOpen(true);
      return;
    }
    state.setOpen(true);
    state.setLoading(true);
    try {
      const report = await generateReport(sessionId);
      state.setReport(report);
    } catch {
      state.setError("Failed to generate report. Please try again.");
    }
  };

  const handleSignOut = () => {
    logout();
    clearMessages();
    useReportStore.getState().reset();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Chat sidebar"
      >
        {/* Close button (mobile) */}
        <div className="flex items-center justify-end p-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-500">
              <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user.displayName}</p>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Suggested topics */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Suggested Topics
            </p>
            <TopicSettingsDialog />
          </div>
          <QuickActions variant="dark" onAction={(prompt) => { onQuickAction(prompt); setSidebarOpen(false); }} />
        </div>

        <Separator className="bg-slate-700" />

        {/* Bottom controls */}
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleNewConversation}
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Conversation
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleGenerateReport}
          >
            <FileBarChart className="h-4 w-4" />
            Executive Report
          </Button>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
