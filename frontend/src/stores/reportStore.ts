import { create } from "zustand";
import type { ExecutiveReport } from "@/types";

interface ReportState {
  report: ExecutiveReport | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  setReport: (report: ExecutiveReport) => void;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  report: null,
  isOpen: false,
  isLoading: false,
  error: null,
  setReport: (report) => set({ report, isLoading: false, error: null }),
  setOpen: (open) => set({ isOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ report: null, isOpen: false, isLoading: false, error: null }),
}));
