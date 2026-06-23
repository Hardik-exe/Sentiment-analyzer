"use client";

import { useState } from "react";
import type { SentenceAnalysis, Sentiment } from "@/lib/types";
import { sentimentColor, EMOTION_LABELS } from "@/lib/sentiment-utils";

const FILTERS: Array<Sentiment | "All"> = ["All", "Positive", "Neutral", "Negative"];

export default function SentenceList({ sentences }: { sentences: SentenceAnalysis[] }) {
  const [filter, setFilter] = useState<Sentiment | "All">("All");

  const filtered =
    filter === "All" ? sentences : sentences.filter((s) => s.sentiment === filter);

  return (
    <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-paper)]">
          Sentence-level breakdown
        </h3>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] uppercase transition-colors ${
                filter === f
                  ? "bg-[var(--color-signal-pos)] text-[var(--color-ink)]"
                  : "bg-[var(--color-ink)] text-[var(--color-paper-dim)] hover:text-[var(--color-paper)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {filtered.map((s, i) => (
          <div
            key={i}
            className="rounded-lg border-l-2 bg-[var(--color-ink)] px-3.5 py-2.5"
            style={{ borderColor: sentimentColor(s.sentiment) }}
          >
            <div className="mb-1 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--color-paper-dim)]">
              <span>{s.speaker}</span>
              <span>·</span>
              <span style={{ color: sentimentColor(s.sentiment) }}>{s.sentiment}</span>
              <span>·</span>
              <span>{EMOTION_LABELS[s.emotion] ?? s.emotion}</span>
            </div>
            <p className="text-sm text-[var(--color-paper)]">{s.sentence}</p>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--color-paper-dim)]">
            No sentences match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
