import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Mock Interview Platform",
  description: "Practice realistic technical interviews with AI, live coding, and video collaboration."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-panel text-ink antialiased dark:bg-slate-950 dark:text-slate-100">{children}</body>
    </html>
  );
}
