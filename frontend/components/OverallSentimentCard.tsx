import type { AnalysisResult } from "@/lib/types";
import { sentimentColor } from "@/lib/sentiment-utils";

export default function OverallSentimentCard({ result }: { result: AnalysisResult }) {
  const color = sentimentColor(result.overall_sentiment);
  const { positive_pct, negative_pct, neutral_pct } = result.sentiment_breakdown;

  return (
    <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-6">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--color-paper-dim)]">
        Overall sentiment
      </p>

      <div className="mt-2 flex items-baseline gap-3">
        <h2
          className="font-[family-name:var(--font-display)] text-4xl font-bold"
          style={{ color }}
        >
          {result.overall_sentiment}
        </h2>
        <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-paper-dim)]">
          {result.overall_confidence}% confidence
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[var(--color-paper-dim)]">
        {result.overall_reasoning}
      </p>

      <div className="mt-5">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-ink)]">
          <div
            style={{ width: `${positive_pct}%`, background: "var(--color-signal-pos)" }}
          />
          <div
            style={{ width: `${neutral_pct}%`, background: "var(--color-signal-neu)" }}
          />
          <div
            style={{ width: `${negative_pct}%`, background: "var(--color-signal-neg)" }}
          />
        </div>
        <div className="mt-2 flex justify-between font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-paper-dim)]">
          <span>{positive_pct}% positive</span>
          <span>{neutral_pct}% neutral</span>
          <span>{negative_pct}% negative</span>
        </div>
      </div>
    </div>
  );
}
