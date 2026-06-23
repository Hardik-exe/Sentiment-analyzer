export type Sentiment = "Positive" | "Negative" | "Neutral";

export type Emotion =
  | "joy"
  | "frustration"
  | "anger"
  | "sadness"
  | "satisfaction"
  | "confusion"
  | "anxiety"
  | "gratitude"
  | "neutral";

export interface SentenceAnalysis {
  sentence: string;
  speaker: string;
  sentiment: Sentiment;
  emotion: Emotion;
  intensity: number;
}

export interface KPIs {
  customer_satisfaction_score: number;
  resolution_status: "Resolved" | "Unresolved" | "Escalated" | "Partially Resolved";
  agent_empathy_score: number;
  sentiment_trend: "Improving" | "Declining" | "Stable" | "Volatile";
  escalation_risk: "Low" | "Medium" | "High";
  escalation_risk_reasoning: string;
  key_issues_mentioned: string[];
  action_items: string[];
  talk_time_balance: string;
}

export interface AnalysisResult {
  success: boolean;
  analyzedAt: string;
  overall_sentiment: Sentiment;
  overall_confidence: number;
  overall_reasoning: string;
  sentiment_breakdown: {
    positive_pct: number;
    negative_pct: number;
    neutral_pct: number;
  };
  sentence_level: SentenceAnalysis[];
  emotion_distribution: Partial<Record<Emotion, number>>;
  conversation_summary: string;
  kpis: KPIs;
}
