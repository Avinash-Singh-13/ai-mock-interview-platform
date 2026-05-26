"use client";

import Editor from "@monaco-editor/react";
import { Play, Save, Send, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { VideoPanel } from "./VideoPanel";

export function CodeRoom({ interview }: { interview: any }) {
  const socketRef = useRef<Socket | null>(null);
  const [code, setCode] = useState(interview.code || interview.question?.starterCode || "");
  const [language, setLanguage] = useState(interview.language || "javascript");
  const [connected, setConnected] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<any[]>(interview.notes || []);
  const [output, setOutput] = useState("Run code to see a browser-side JavaScript result.");
  const [feedback, setFeedback] = useState<any>(interview.feedback);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("room:join", { roomId: interview.id, user: { name: "Participant" } });
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("room:state", (state) => {
      if (state.code) setCode(state.code);
      if (state.language) setLanguage(state.language);
      if (state.notes?.length) setNotes(state.notes);
    });
    socket.on("code:update", (payload) => {
      setCode(payload.code);
      setLanguage(payload.language);
    });
    socket.on("notes:update", setNotes);
    return () => socket.disconnect();
  }, [interview.id]);

  function update(next: string = "") {
    setCode(next);
    socketRef.current?.emit("code:update", { roomId: interview.id, code: next, language });
  }

  async function save() {
    await fetch(`/api/interviews/${interview.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });
    setOutput("Auto-save complete.");
  }

  function run() {
    if (language !== "javascript") {
      setOutput("Local execution is enabled for JavaScript. Other languages are collaborative editing only in this demo.");
      return;
    }
    try {
      const logs: string[] = [];
      const fn = new Function("console", `${code}\nreturn typeof maxExecutableTasks === "function" ? "Function loaded." : "Code executed.";`);
      const result = fn({ log: (...args: unknown[]) => logs.push(args.map(String).join(" ")) });
      setOutput([...logs, String(result)].join("\n"));
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Execution failed.");
    }
  }

  async function addNote() {
    if (!note.trim()) return;
    socketRef.current?.emit("notes:add", { roomId: interview.id, note });
    await fetch(`/api/interviews/${interview.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });
    setNote("");
  }

  async function submit() {
    setBusy(true);
    const res = await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewId: interview.id, code, language })
    });
    const json = await res.json();
    setBusy(false);
    if (json.ok) setFeedback(json.data.feedback);
    else setOutput(json.error.message);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_390px]">
      <section className="min-w-0 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-3 dark:border-slate-800">
          <div>
            <h1 className="font-bold">{interview.question?.title}</h1>
            <p className="text-sm text-slate-500">{interview.category} · {interview.difficulty}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${connected ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>{connected ? <Wifi size={14} /> : <WifiOff size={14} />} {connected ? "Synced" : "Offline"}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="focus-ring rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-slate-200 p-4 text-sm leading-6 dark:border-slate-800 lg:border-b-0 lg:border-r">
            <p>{interview.question?.prompt}</p>
            <h2 className="mt-4 font-semibold">Constraints</h2>
            <ul className="mt-2 list-disc pl-5 text-slate-600 dark:text-slate-300">{interview.question?.constraints?.map((c: string) => <li key={c}>{c}</li>)}</ul>
            <h2 className="mt-4 font-semibold">Examples</h2>
            <ul className="mt-2 list-disc pl-5 text-slate-600 dark:text-slate-300">{interview.question?.examples?.map((c: string) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div className="min-h-[560px]">
            <Editor height="560px" theme="vs-dark" language={language === "typescript" ? "typescript" : language === "python" ? "python" : language === "java" ? "java" : "javascript"} value={code} onChange={(value) => update(value || "")} options={{ minimap: { enabled: false }, fontSize: 14, tabSize: 2, automaticLayout: true }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
          <button onClick={run} className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700"><Play size={16} /> Run</button>
          <button onClick={save} className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700"><Save size={16} /> Save</button>
          <button onClick={submit} disabled={busy} className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"><Send size={16} /> {busy ? "Reviewing..." : "Submit"}</button>
        </div>
      </section>
      <aside className="space-y-4">
        <VideoPanel roomId={interview.id} socketRef={socketRef} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold">Console</h2>
          <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-slate-950 p-3 text-sm text-slate-100">{output}</pre>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold">Interviewer notes</h2>
          <div className="mt-3 flex gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} className="focus-ring min-w-0 flex-1 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700" placeholder="Add observation" />
            <button onClick={addNote} className="focus-ring rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">Add</button>
          </div>
          <div className="mt-3 space-y-2">{notes.map((n) => <p key={n.id || n._id || n.text} className="rounded-md bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">{n.text}</p>)}</div>
        </div>
        {feedback && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold">AI feedback · {feedback.score ?? "N/A"}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feedback.summary}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">{feedback.improvements?.map((i: string) => <li key={i}>{i}</li>)}</ul>
          </div>
        )}
      </aside>
    </div>
  );
}
