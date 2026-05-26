"use client";

import { DoorOpen, FileText, UsersRound, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";

export default function InterviewerDashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const cards: { label: string; value: string | number; Icon: LucideIcon }[] = [
    { label: "Active rooms", value: rooms.length, Icon: UsersRound },
    { label: "Records", value: history.length, Icon: FileText },
    { label: "Live access", value: "Ready", Icon: DoorOpen }
  ];

  useEffect(() => {
    fetch("/api/interviews/rooms").then((r) => r.json()).then((j) => {
      if (!j.ok && j.error?.message === "Not authenticated.") router.push("/");
      if (j.ok) setRooms(j.data.rooms);
    });
    fetch("/api/interviews").then((r) => r.json()).then((j) => j.ok && setHistory(j.data.interviews));
  }, [router]);

  return (
    <DashboardShell title="Interviewer Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <Icon className="mb-3 text-coral" size={20} />
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{String(value)}</p>
          </div>
        ))}
      </div>
      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Active interview rooms</h2>
          <div className="mt-4 space-y-3">
            {rooms.length === 0 && <p className="text-sm text-slate-500">No active rooms right now.</p>}
            {rooms.map((room) => (
              <a key={room.id} href={`/interview/${room.id}`} className="focus-ring flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:border-brand dark:border-slate-800">
                <div>
                  <p className="font-semibold">{room.candidate}</p>
                  <p className="text-sm text-slate-500">{room.category} · {room.difficulty}</p>
                </div>
                <DoorOpen size={18} />
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Previous records</h2>
          <div className="mt-4 space-y-3">
            {history.map((item) => (
              <a key={item.id} href={`/interview/${item.id}`} className="focus-ring block rounded-lg border border-slate-200 p-4 hover:border-brand dark:border-slate-800">
                <p className="font-semibold">{item.question?.title || `${item.category} interview`}</p>
                <p className="text-sm text-slate-500">{item.category} · {item.difficulty} · {item.status}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
