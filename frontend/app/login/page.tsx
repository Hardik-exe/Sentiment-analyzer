"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-ink)] px-6">
      {/* Ambient waveform backdrop */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,400 Q50,340 100,400 T200,400 Q230,250 260,400 T320,400 Q360,500 400,400 T500,400 Q540,200 580,400 T680,400 Q710,460 740,400 T840,400 Q890,300 940,400 T1040,400 Q1080,440 1120,400 T1200,400"
          fill="none"
          stroke="var(--color-signal-pos)"
          strokeWidth="2"
          strokeDasharray="1000"
          style={{ animation: "waveform-draw 2.4s ease-out forwards" }}
        />
      </svg>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-signal-pos)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal-pos)]" />
            signal
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-paper)]">
            Read the room.
          </h1>
          <p className="mt-2 text-sm text-[var(--color-paper-dim)]">
            Sign in to analyze a conversation transcript.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-7 shadow-2xl shadow-black/40"
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-paper-dim)]"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-ink-line)] bg-[var(--color-ink)] px-3.5 py-2.5 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper-dim)] focus:border-[var(--color-signal-pos)] focus:outline-none"
              placeholder="operator"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--color-paper-dim)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-ink-line)] bg-[var(--color-ink)] px-3.5 py-2.5 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper-dim)] focus:border-[var(--color-signal-pos)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-[var(--color-signal-neg)]/30 bg-[var(--color-signal-neg)]/10 px-3.5 py-2.5 text-sm text-[var(--color-signal-neg)]"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-signal-pos)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
