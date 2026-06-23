"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { Emotion } from "@/lib/types";
import { EMOTION_LABELS, EMOTION_COLORS } from "@/lib/sentiment-utils";

export default function EmotionChart({
  distribution,
}: {
  distribution: Partial<Record<Emotion, number>>;
}) {
  const data = (Object.keys(distribution) as Emotion[])
    .filter((e) => (distribution[e] ?? 0) > 0)
    .map((e) => ({
      emotion: EMOTION_LABELS[e],
      count: distribution[e],
      color: EMOTION_COLORS[e],
    }))
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-paper)]">
          Emotion detection
        </h3>
        <p className="mt-2 text-sm text-[var(--color-paper-dim)]">No emotion data available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-paper)]">
        Emotion detection
      </h3>
      <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-paper-dim)]">
        SENTENCE-LEVEL EMOTION COUNTS
      </p>

      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="emotion"
            tick={{ fill: "var(--color-paper-dim)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            cursor={{ fill: "var(--color-ink-line)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg border border-[var(--color-ink-line)] bg-[var(--color-ink)] px-3 py-2 text-xs text-[var(--color-paper)] shadow-xl">
                  {d.emotion}: {d.count} sentence{d.count === 1 ? "" : "s"}
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={700}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
