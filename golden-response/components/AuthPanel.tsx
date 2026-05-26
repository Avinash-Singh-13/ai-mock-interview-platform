"use client";

import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export function AuthPanel() {
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [role, setRole] = useState<"candidate" | "interviewer">("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || "Practice User"),
      email: String(form.get("email")),
      password: String(form.get("password")),
      role
    };
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setError(json.error.message);
      return;
    }
    setUser(json.data.user);
    router.push(json.data.user.role === "interviewer" ? "/dashboard/interviewer" : "/dashboard/candidate");
  }

  return (
    <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex rounded-md bg-slate-100 p-1 dark:bg-slate-800" role="tablist">
        {(["register", "login"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setMode(item)} className={`focus-ring flex-1 rounded px-3 py-2 text-sm font-medium capitalize ${mode === item ? "bg-white text-brand shadow-sm dark:bg-slate-950" : "text-slate-600 dark:text-slate-300"}`}>
            {item}
          </button>
        ))}
      </div>
      {mode === "register" && <input name="name" className="focus-ring mb-3 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Full name" required />}
      <input name="email" type="email" className="focus-ring mb-3 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Email" required />
      <input name="password" type="password" className="focus-ring mb-3 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Password" minLength={8} required />
      {mode === "register" && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(["candidate", "interviewer"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setRole(item)} className={`focus-ring rounded-md border px-3 py-2 text-sm capitalize ${role === item ? "border-brand bg-blue-50 text-brand dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-700"}`}>
              {item}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
      <button disabled={loading} className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 font-semibold text-white disabled:opacity-60">
        {mode === "register" ? <UserPlus size={18} /> : <LogIn size={18} />}
        {loading ? "Working..." : mode === "register" ? "Create account" : "Sign in"}
      </button>
    </motion.form>
  );
}
