"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Clock3, Code2, Sparkles, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";

const categories = ["DSA", "Frontend", "Backend"] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;

export default function CandidateDashboard() {
  const router = useRouter();
  const [category, setCategory] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const average = useMemo(() => {
    const scores = interviews.map((i) => i.feedback?.score).filter((n) => typeof n === "number");
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [interviews]);
  const cards: { label: string; value: string | number; Icon: LucideIcon }[] = [
    { label: "Sessions", value: interviews.length, Icon: Clock3 },
    { label: "Average score", value: average || "New", Icon: BarChart3 },
    { label: "Categories", value: new Set(interviews.map((i) => i.category)).size || 3, Icon: Code2 },
    { label: "AI feedback", value: interviews.filter((i) => i.feedback).length, Icon: Sparkles }
  ];

  useEffect(() => {
    fetch("/api/interviews").then((r) => r.json()).then((j) => {
      if (!j.ok && j.error?.message === "Not authenticated.") router.push("/");
      if (j.ok) setInterviews(j.data.interviews);
    });
  }, [router]);

  async function start() {
    setLoading(true);
    const res = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, difficulty })
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) router.push(`/interview/${json.data.interview.id}`);
  }

  return (
    <DashboardShell title="Candidate Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <Icon className="mb-3 text-brand" size={20} />
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{String(value)}</p>
          </motion.div>
        ))}
      </div>
      <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Start a new interview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose the focus and difficulty, then enter a live coding room.</p>
          <div className="mt-5">
            <p className="mb-2 text-sm font-medium">Category</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`focus-ring rounded-md border px-3 py-2 ${category === item ? "border-brand bg-blue-50 text-brand dark:bg-blue-950/40" : "border-slate-200 dark:border-slate-700"}`}>{item}</button>)}
            </div>
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm font-medium">Difficulty</p>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((item) => <button key={item} onClick={() => setDifficulty(item)} className={`focus-ring rounded-md border px-3 py-2 ${difficulty === item ? "border-mint bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200" : "border-slate-200 dark:border-slate-700"}`}>{item}</button>)}
            </div>
          </div>
          <button onClick={start} disabled={loading} className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? "Generating..." : "Start Interview"} <ArrowRight size={18} />
          </button>
        </div>
        <HistoryList interviews={interviews} />
      </section>
    </DashboardShell>
  );
}

function HistoryList({ interviews }: { interviews: any[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold">Previous interviews</h2>
      <div className="mt-4 space-y-3">
        {interviews.length === 0 && <p className="text-sm text-slate-500">No sessions yet. Your completed feedback will appear here.</p>}
        {interviews.map((item) => (
          <a key={item.id} href={`/interview/${item.id}`} className="focus-ring block rounded-lg border border-slate-200 p-4 hover:border-brand dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{item.question?.title || `${item.category} interview`}</p>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">{item.status}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{item.category} · {item.difficulty} · Score {item.feedback?.score ?? "pending"}</p>
            {item.feedback?.summary && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.feedback.summary}</p>}
          </a>
        ))}
      </div>
    </div>
  );
}
