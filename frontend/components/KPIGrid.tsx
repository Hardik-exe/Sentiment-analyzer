import type { KPIs } from "@/lib/types";
import { riskColor } from "@/lib/sentiment-utils";
import { TrendingUp, TrendingDown, Minus, Activity, ShieldAlert, Heart, Gauge, Users } from "lucide-react";

function trendIcon(trend: KPIs["sentiment_trend"]) {
  switch (trend) {
    case "Improving":
      return <TrendingUp className="h-4 w-4 text-[var(--color-signal-pos)]" />;
    case "Declining":
      return <TrendingDown className="h-4 w-4 text-[var(--color-signal-neg)]" />;
    case "Volatile":
      return <Activity className="h-4 w-4 text-[var(--color-amber)]" />;
    default:
      return <Minus className="h-4 w-4 text-[var(--color-signal-neu)]" />;
  }
}

function StatTile({
  icon,
  label,
  value,
  valueColor,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink)] p-4">
      <div className="flex items-center gap-2 text-[var(--color-paper-dim)]">
        {icon}
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p
        className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold"
        style={{ color: valueColor || "var(--color-paper)" }}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-[var(--color-paper-dim)]">{sub}</p>}
    </div>
  );
}

export default function KPIGrid({ kpis }: { kpis: KPIs }) {
  return (
    <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
      <h3 className="mb-4 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-paper)]">
        Call KPIs
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          icon={<Gauge className="h-3.5 w-3.5" />}
          label="CSAT estimate"
          value={`${kpis.customer_satisfaction_score}`}
          valueColor={
            kpis.customer_satisfaction_score >= 70
              ? "var(--color-signal-pos)"
              : kpis.customer_satisfaction_score >= 40
              ? "var(--color-amber)"
              : "var(--color-signal-neg)"
          }
        />
        <StatTile
          icon={<Heart className="h-3.5 w-3.5" />}
          label="Agent empathy"
          value={`${kpis.agent_empathy_score}`}
        />
        <StatTile
          icon={trendIcon(kpis.sentiment_trend)}
          label="Sentiment trend"
          value={kpis.sentiment_trend}
        />
        <StatTile
          icon={<ShieldAlert className="h-3.5 w-3.5" />}
          label="Escalation risk"
          value={kpis.escalation_risk}
          valueColor={riskColor(kpis.escalation_risk)}
          sub={kpis.escalation_risk_reasoning}
        />
        <StatTile
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Resolution"
          value={kpis.resolution_status}
        />
        <StatTile
          icon={<Users className="h-3.5 w-3.5" />}
          label="Talk balance"
          value={kpis.talk_time_balance}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink)] p-4">
          <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--color-paper-dim)]">
            Key issues
          </p>
          {kpis.key_issues_mentioned?.length ? (
            <ul className="space-y-1.5">
              {kpis.key_issues_mentioned.map((issue, i) => (
                <li key={i} className="text-sm text-[var(--color-paper)]">
                  · {issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-paper-dim)]">None identified.</p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink)] p-4">
          <p className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--color-paper-dim)]">
            Suggested follow-ups
          </p>
          {kpis.action_items?.length ? (
            <ul className="space-y-1.5">
              {kpis.action_items.map((item, i) => (
                <li key={i} className="text-sm text-[var(--color-paper)]">
                  · {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-paper-dim)]">None identified.</p>
          )}
        </div>
      </div>
    </div>
  );
}
