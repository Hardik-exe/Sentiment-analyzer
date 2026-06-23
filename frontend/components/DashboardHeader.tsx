"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function DashboardHeader({ username }: { username: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-ink-line)] px-6 py-4 sm:px-10">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal-pos)]" />
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-[var(--color-paper)]">
          SIGNAL
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-paper-dim)]">
          {username}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-[var(--color-paper-dim)] hover:bg-[var(--color-ink-line)] hover:text-[var(--color-paper)]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </header>
  );
}
