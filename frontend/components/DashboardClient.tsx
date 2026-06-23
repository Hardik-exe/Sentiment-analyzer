"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import UploadPanel from "@/components/UploadPanel";
import OverallSentimentCard from "@/components/OverallSentimentCard";
import SentimentWaveform from "@/components/SentimentWaveform";
import EmotionChart from "@/components/EmotionChart";
import KPIGrid from "@/components/KPIGrid";
import ConversationSummary from "@/components/ConversationSummary";
import SentenceList from "@/components/SentenceList";
import type { AnalysisResult } from "@/lib/types";

export default function DashboardClient() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  if (!result) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:px-10">
        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-paper)]">
            Upload a conversation
          </h1>
          <p className="mt-2 text-sm text-[var(--color-paper-dim)]">
            Drop in a call transcript as a .txt file. We&apos;ll break down sentiment,
            emotion, and the KPIs that matter.
          </p>
        </div>
        <UploadPanel onResult={setResult} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-10">
      <button
        onClick={() => setResult(null)}
        className="mb-6 flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-paper-dim)] hover:text-[var(--color-paper)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Analyze another transcript
      </button>

      <div className="grid gap-5">
        <OverallSentimentCard result={result} />
        <SentimentWaveform sentences={result.sentence_level} />

        <div className="grid gap-5 sm:grid-cols-2">
          <EmotionChart distribution={result.emotion_distribution} />
          <ConversationSummary summary={result.conversation_summary} />
        </div>

        <KPIGrid kpis={result.kpis} />
        <SentenceList sentences={result.sentence_level} />
      </div>
    </div>
  );
}
