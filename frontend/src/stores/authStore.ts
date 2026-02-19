import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  sessionId: string | null;
  customerId: string | null;
  isAuthenticated: boolean;
  login: (user: User, sessionId: string, customerId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionId: null,
  customerId: null,
  isAuthenticated: false,
  login: (user, sessionId, customerId) =>
    set({ user, sessionId, customerId, isAuthenticated: true }),
  logout: () =>
    set({ user: null, sessionId: null, customerId: null, isAuthenticated: false }),
}));
