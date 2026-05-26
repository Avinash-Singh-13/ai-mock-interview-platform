import { ArrowRight, Bot, Code2, History, MessageSquareText, Video, type LucideIcon } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { ThemeToggle } from "@/components/ThemeToggle";

const features: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "AI questions", body: "Dynamic prompts for DSA, frontend, and backend practice.", Icon: Bot },
  { title: "Shared coding", body: "Monaco editor syncs code live with interviewer rooms.", Icon: Code2 },
  { title: "Live calls", body: "WebRTC video and audio controls for realistic sessions.", Icon: Video },
  { title: "Feedback", body: "AI summaries cover logic, complexity, quality, and next steps.", Icon: MessageSquareText }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">AI</span>
          MockInterview
        </div>
        <ThemeToggle />
      </nav>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-mint">Realistic technical interview practice</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">AI Mock Interview Platform</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Practice coding interviews with AI-generated questions, live collaboration, video/audio rooms, and interview feedback that feels close to a real technical screen.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 font-semibold text-white" href="#auth">Start Interview <ArrowRight size={18} /></a>
            <a className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 font-semibold dark:border-slate-700" href="/dashboard/candidate">View Dashboard <History size={18} /></a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
            {["DSA", "Frontend", "Backend"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="font-semibold">{item}</div>
                <div className="text-slate-500 dark:text-slate-400">Easy to hard</div>
              </div>
            ))}
          </div>
        </div>
        <div id="auth" className="flex items-center justify-center">
          <AuthPanel />
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-4">
          {features.map(({ title, body, Icon }) => (
            <div key={title} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <Icon className="mb-3 text-coral" size={22} />
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {["92% report clearer prep goals", "Live rooms sync in milliseconds", "History tracks every submission"].map((stat) => (
          <div key={stat} className="rounded-lg bg-slate-900 p-5 text-white dark:bg-slate-800">
            <p className="text-2xl font-bold">{stat}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
