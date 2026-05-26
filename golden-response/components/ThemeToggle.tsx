"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const enabled = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button onClick={toggle} className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" aria-label="Toggle dark mode">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
