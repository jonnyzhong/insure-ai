import { create } from "zustand";

export interface Topic {
  label: string;
  prompt: string;
}

export const DEFAULT_TOPICS: Topic[] = [
  { label: "My Policies", prompt: "Show me my policies" },
  { label: "File a Claim", prompt: "I want to file a new claim" },
  { label: "Billing History", prompt: "Show my billing history" },
  { label: "What is NCD?", prompt: "What is NCD?" },
  { label: "Vehicle Details", prompt: "Show my vehicle details" },
];

const STORAGE_KEY = "suggested-topics";

function loadTopics(): Topic[] {
  if (typeof window === "undefined") return DEFAULT_TOPICS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_TOPICS;
}

function saveTopics(topics: Topic[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
}

interface TopicsState {
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  resetDefaults: () => void;
}

export const useTopicsStore = create<TopicsState>((set) => ({
  topics: loadTopics(),
  setTopics: (topics) => {
    saveTopics(topics);
    set({ topics });
  },
  resetDefaults: () => {
    saveTopics(DEFAULT_TOPICS);
    set({ topics: DEFAULT_TOPICS });
  },
}));
