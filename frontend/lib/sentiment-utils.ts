import type { Sentiment, Emotion } from "./types";

export function sentimentColor(s: Sentiment): string {
  switch (s) {
    case "Positive":
      return "var(--color-signal-pos)";
    case "Negative":
      return "var(--color-signal-neg)";
    default:
      return "var(--color-signal-neu)";
  }
}

export function sentimentScore(s: Sentiment): number {
  // Maps sentiment to a -1..1 axis for plotting a continuous waveform.
  switch (s) {
    case "Positive":
      return 1;
    case "Negative":
      return -1;
    default:
      return 0;
  }
}

export const EMOTION_LABELS: Record<Emotion, string> = {
  joy: "Joy",
  frustration: "Frustration",
  anger: "Anger",
  sadness: "Sadness",
  satisfaction: "Satisfaction",
  confusion: "Confusion",
  anxiety: "Anxiety",
  gratitude: "Gratitude",
  neutral: "Neutral",
};

export const EMOTION_COLORS: Record<Emotion, string> = {
  joy: "#5eead4",
  satisfaction: "#34d399",
  gratitude: "#a3e635",
  neutral: "#94a3b8",
  confusion: "#f5a623",
  anxiety: "#fb923c",
  sadness: "#818cf8",
  frustration: "#fb7185",
  anger: "#ef4444",
};

export function riskColor(level: "Low" | "Medium" | "High"): string {
  switch (level) {
    case "Low":
      return "var(--color-signal-pos)";
    case "Medium":
      return "var(--color-amber)";
    case "High":
      return "var(--color-signal-neg)";
  }
}
