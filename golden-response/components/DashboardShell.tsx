"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/");
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">MockInterview</p>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout} className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </main>
  );
}
