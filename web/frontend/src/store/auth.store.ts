import { create } from "zustand";
import { ApiUser } from "@/lib/api";

interface AuthState {
  user: ApiUser | null;
  isAuthenticated: boolean;
  setUser: (user: ApiUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
