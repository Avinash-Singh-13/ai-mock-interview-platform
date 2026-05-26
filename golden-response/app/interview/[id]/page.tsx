import { CodeRoom } from "@/components/CodeRoom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getInterview(id: string) {
  const cookieHeader = (await cookies()).toString();
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/interviews/${id}`, { headers: { cookie: cookieHeader }, cache: "no-store" });
  const json = await res.json();
  if (!json.ok) return null;
  return json.data.interview;
}

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const interview = await getInterview(id);
  if (!interview) redirect("/");
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3">
          <a href="/dashboard/candidate" className="font-bold">MockInterview Room</a>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        <CodeRoom interview={interview} />
      </div>
    </main>
  );
}
