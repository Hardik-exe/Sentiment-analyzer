export default function ConversationSummary({ summary }: { summary: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-paper)]">
        Conversation summary
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-paper-dim)]">{summary}</p>
    </div>
  );
}
