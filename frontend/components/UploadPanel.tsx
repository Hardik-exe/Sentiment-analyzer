"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

interface UploadPanelProps {
  onResult: (result: AnalysisResult) => void;
}

export default function UploadPanel({ onResult }: UploadPanelProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Only .txt files are supported.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File is too large. Max 2MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setTranscript(String(reader.result || ""));
      setFileName(file.name);
    };
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsText(file);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  function clearFile() {
    setFileName(null);
    setTranscript("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleAnalyze() {
    if (!transcript.trim()) {
      setError("Add a transcript before analyzing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed. Try again.");
        setLoading(false);
        return;
      }

      onResult(data as AnalysisResult);
    } catch {
      setError("Could not reach the analysis service.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {!fileName ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors ${
            dragActive
              ? "border-[var(--color-signal-pos)] bg-[var(--color-signal-pos)]/5"
              : "border-[var(--color-ink-line)] hover:border-[var(--color-paper-dim)]"
          }`}
        >
          <UploadCloud
            className="mb-4 h-9 w-9 text-[var(--color-paper-dim)] transition-colors group-hover:text-[var(--color-signal-pos)]"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-[var(--color-paper)]">
            Drop a transcript, or click to browse
          </p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-[var(--color-paper-dim)]">
            .TXT — UP TO 2MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".txt,text/plain"
            onChange={handleSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-signal-pos)]/10">
                <FileText className="h-5 w-5 text-[var(--color-signal-pos)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-paper)]">
                  {fileName}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-paper-dim)]">
                  {transcript.length.toLocaleString()} characters · ~
                  {Math.max(1, Math.round(transcript.split(/\s+/).length / 130))}{" "}
                  min read
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              aria-label="Remove file"
              className="rounded-md p-1.5 text-[var(--color-paper-dim)] hover:bg-[var(--color-ink-line)] hover:text-[var(--color-paper)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            className="mt-4 w-full resize-none rounded-lg border border-[var(--color-ink-line)] bg-[var(--color-ink)] p-3 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--color-paper-dim)] focus:border-[var(--color-signal-pos)] focus:outline-none"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-signal-pos)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing conversation…
              </>
            ) : (
              "Analyze sentiment"
            )}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-[var(--color-signal-neg)]">
          {error}
        </p>
      )}
    </div>
  );
}
