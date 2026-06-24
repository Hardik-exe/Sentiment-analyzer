# Signal — Conversation Sentiment Analyzer

A full-stack AI application that takes a call transcript, analyzes it through an
orchestrated AI pipeline, and presents sentiment, emotion, and call-center KPIs
on an interactive dashboard.

## Architecture

```
┌─────────────┐   POST /api/analyze   ┌──────────────┐   HTTP   ┌─────────────┐
│  Next.js UI │ ─────────────────────▶│  n8n webhook │ ───────▶ │  Gemini 2.5 │
│  (Vercel)   │ ◀───────────────────── │  workflow    │          │  Flash      │
└─────────────┘     JSON result        └──────┬───────┘ ◀─────── └─────────────┘
                                               │ fallback on failure
                                               ▼
                                        ┌─────────────┐
                                        │  Groq        │
                                        │  Llama 3.3   │
                                        └─────────────┘
```

The frontend never calls an AI provider directly. Every analysis request goes
through an **n8n orchestration layer**, which owns the prompt, the provider
choice, and the response shaping. This keeps the AI logic swappable —
changing models, providers, or adding new analysis steps requires no frontend
changes or redeployment.

**Resilience:** if the primary provider (Gemini) fails for any reason — quota
exhaustion, timeout, outage — the workflow automatically detects the failure
and retries the identical prompt against a second provider (Groq, running
Llama 3.3 70B) with no user-visible disruption. This was built and verified
by deliberately breaking the primary provider's credentials and confirming
the pipeline still returned a complete, correctly-shaped result.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Recharts |
| Auth | Session-based via signed JWT cookies, bcrypt-hashed credentials (no database) |
| Orchestration | n8n (webhook → prompt construction → AI call → validation → response) |
| Primary AI | Google Gemini 2.5 Flash |
| Fallback AI | Groq (Llama 3.3 70B) |
| Hosting | Vercel (frontend), n8n Cloud (orchestration) |

## Meeting the output expectations

- **Overall sentiment** (Positive / Negative / Neutral) with a confidence
  score and a written explanation grounded in the actual transcript content
- **Sentence-level sentiment** for every line of the conversation, each
  tagged with speaker, sentiment, emotion, intensity, and a short reasoning
  phrase naming the specific cue that drove the call
- **Call-center KPIs**, chosen for relevance to phone support specifically
  rather than generic text sentiment: CSAT estimate, resolution status,
  agent empathy score, sentiment trend across the call, escalation risk
  (with reasoning), key issues raised, suggested follow-ups, and talk-time
  balance between speakers

## How AI quality is addressed

Two deliberate prompt-design choices target the "logical accuracy" and
"clear reasoning" evaluation criteria directly, rather than treating them as
implicit:

1. **Reasoning is a required output field, not an afterthought.** The model
   must justify the overall sentiment, the escalation risk assessment, and
   every individual sentence's sentiment call. A label with no justification
   is not a valid output under this schema.
2. **The prompt explicitly forbids the most common LLM sentiment failure
   mode** — defaulting to a safe Neutral/Positive label under ambiguity. It
   instructs the model to be analytically honest and to ground reasoning in
   specific transcript content rather than generic statements.

This makes the model's reasoning inspectable at every level of the output,
so accuracy can be judged by reading *why* a call was made, not just trusting
the label.

## Creativity

- **Sentiment waveform** — sentence-by-sentence sentiment plotted as a
  continuous signal across the call, styled like an audio/ECG waveform,
  with hover tooltips showing the sentence and its reasoning
- **Emotion distribution chart** — counts across nine emotion categories
  (joy, frustration, anger, sadness, satisfaction, confusion, anxiety,
  gratitude, neutral), not just three-way sentiment
- **AI-generated conversation summary**
- **Six-plus KPIs** beyond the minimum ask, including escalation risk with
  reasoning, talk-time balance, and suggested action items
- **Dual-provider resilience**, an architecture-level creativity choice that
  also demonstrates production-mindedness

## Known limitations

- No database — by design, to match the assignment's "basic auth is fine"
  scope. A single operator account is configured via environment variables,
  with the password stored as a bcrypt hash rather than plaintext. Swapping
  in a real users table later requires changing one function
  (`lib/auth.ts`), not restructuring the app.
- n8n Cloud's free trial occasionally deactivates idle workflows; this is a
  trial-tier behavior, not an application defect, and does not occur on a
  paid plan or a self-hosted instance.
