"use client";

import { create } from "zustand";

type User = { id: string; name: string; email: string; role: "candidate" | "interviewer" };

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  refresh: () => Promise<User | null>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  refresh: async () => {
    const res = await fetch("/api/auth/me");
    const json = await res.json();
    const user = json.ok ? json.data.user : null;
    set({ user });
    return user;
  }
}));
