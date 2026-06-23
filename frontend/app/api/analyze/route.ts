import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const MAX_CHARS = 50000;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nUrl) {
    return NextResponse.json(
      { error: "Server is missing N8N_WEBHOOK_URL configuration." },
      { status: 500 }
    );
  }

  let body: { transcript?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const transcript = body.transcript?.trim();

  if (!transcript) {
    return NextResponse.json(
      { error: "Transcript text is empty." },
      { status: 400 }
    );
  }

  if (transcript.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `Transcript exceeds the ${MAX_CHARS.toLocaleString()} character limit.` },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const n8nResponse = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await n8nResponse.json();

    if (!n8nResponse.ok || data.success === false) {
      return NextResponse.json(
        { error: data.error || "Analysis pipeline returned an error." },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error("n8n proxy error:", err);
    return NextResponse.json(
      {
        error: isAbort
          ? "Analysis timed out. The transcript may be too long, or the analysis service is unreachable."
          : "Could not reach the analysis service. Confirm n8n is running and N8N_WEBHOOK_URL is correct.",
      },
      { status: 502 }
    );
  }
}
