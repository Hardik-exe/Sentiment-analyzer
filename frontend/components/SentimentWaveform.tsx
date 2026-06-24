"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { SentenceAnalysis } from "@/lib/types";
import { sentimentScore } from "@/lib/sentiment-utils";

interface WaveformProps {
  sentences: SentenceAnalysis[];
}

export default function SentimentWaveform({ sentences }: WaveformProps) {
  const data = sentences.map((s, i) => ({
    index: i + 1,
    score: sentimentScore(s.sentiment) * (s.intensity / 100 || 0.4),
    sentiment: s.sentiment,
    sentence: s.sentence,
    speaker: s.speaker,
    reason: s.reason,
  }));

  return (
    <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-paper)]">
            Sentiment waveform
          </h3>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-paper-dim)]">
            SIGNAL ACROSS {sentences.length} SENTENCES
          </p>
        </div>
        <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[var(--color-paper-dim)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-signal-pos)]" /> pos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-signal-neu)]" /> neu
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--color-signal-neg)]" /> neg
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="waveformFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" stopOpacity={0.35} />
              <stop offset="50%" stopColor="#5eead4" stopOpacity={0.05} />
              <stop offset="50%" stopColor="#fb7185" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <ReferenceLine y={0} stroke="var(--color-ink-line)" strokeWidth={1} />
          <XAxis
            dataKey="index"
            tick={{ fill: "var(--color-paper-dim)", fontSize: 10 }}
            axisLine={{ stroke: "var(--color-ink-line)" }}
            tickLine={false}
            label={{
              value: "Conversation timeline →",
              position: "insideBottom",
              offset: -2,
              fill: "var(--color-paper-dim)",
              fontSize: 10,
            }}
          />
          <YAxis domain={[-1, 1]} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="max-w-[240px] rounded-lg border border-[var(--color-ink-line)] bg-[var(--color-ink)] p-3 text-xs shadow-xl">
                  <p className="mb-1 font-[family-name:var(--font-mono)] uppercase text-[var(--color-paper-dim)]">
                    {d.speaker} · {d.sentiment}
                  </p>
                  <p className="text-[var(--color-paper)]">{d.sentence}</p>
                  {d.reason && (
                    <p className="mt-1 italic text-[var(--color-paper-dim)]">↳ {d.reason}</p>
                  )}
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#5eead4"
            strokeWidth={1.5}
            fill="url(#waveformFill)"
            isAnimationActive={true}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
