import { create } from "zustand";
import type { Message, AgentType } from "@/types";

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  activeAgent: AgentType | null;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setTyping: (typing: boolean) => void;
  setActiveAgent: (agent: AgentType | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  activeAgent: null,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setTyping: (typing) => set({ isTyping: typing }),
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  clearMessages: () => set({ messages: [] }),
}));
