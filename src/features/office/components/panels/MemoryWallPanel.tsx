"use client";

import { useState, useEffect, useCallback } from "react";
import { t, tReplace } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MemoryItem = {
  id: string;
  content: string;
  author: string;
  color: string;
  timestamp: number;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "memory-wall-items";

const STICKY_COLORS = [
  "#fbbf24", // amber
  "#f87171", // red
  "#34d399", // emerald
  "#60a5fa", // blue
  "#c084fc", // purple
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateId(): string {
  return `mw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatRelativeTime(timestampMs: number): string {
  const deltaMs = Date.now() - timestampMs;
  if (deltaMs < 60_000) return t("memoryWall.justNow");
  if (deltaMs < 3_600_000)
    return tReplace("memoryWall.minutesAgo", {
      count: Math.max(1, Math.floor(deltaMs / 60_000)),
    });
  if (deltaMs < 86_400_000)
    return tReplace("memoryWall.hoursAgo", {
      count: Math.max(1, Math.floor(deltaMs / 3_600_000)),
    });
  return tReplace("memoryWall.daysAgo", {
    count: Math.max(1, Math.floor(deltaMs / 86_400_000)),
  });
}

function loadMemories(): MemoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MemoryItem[];
  } catch {
    return [];
  }
}

function saveMemories(items: MemoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MemoryWallPanel() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0]);

  // Load from localStorage on mount
  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  // Persist whenever memories change (skip initial empty render)
  useEffect(() => {
    saveMemories(memories);
  }, [memories]);

  // Refresh relative timestamps every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = useCallback(() => {
    const trimmedContent = newContent.trim();
    if (!trimmedContent) return;

    const item: MemoryItem = {
      id: generateId(),
      content: trimmedContent,
      author: newAuthor.trim() || "Anonim",
      color: selectedColor,
      timestamp: Date.now(),
    };

    setMemories((prev) => [item, ...prev]);
    setNewContent("");
  }, [newContent, newAuthor, selectedColor]);

  const handleDelete = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  return (
    <section className="flex h-full min-h-0 flex-col">
      {/* ---- Header ---- */}
      <div className="border-b border-cyan-500/10 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-400"
          >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3 4 4.5 4.5 0 0 1-3-4" />
            <path d="M12 18v4" />
            <path d="M17.5 10c.5 0 1-.4 1-1" />
            <path d="M5.5 10c-.5 0-1-.4-1-1" />
          </svg>
          {t("memoryWall.title")}
        </div>
      </div>

      {/* ---- Add Form ---- */}
      <div className="border-b border-cyan-500/10 px-4 py-3">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("memoryWall.placeholder")}
          rows={2}
          className="w-full resize-none rounded border border-white/10 bg-black/50 px-3 py-2 font-mono text-[12px] text-white/80 placeholder-white/30 outline-none focus:border-amber-400/40"
        />

        <div className="mt-2 flex items-center gap-3">
          {/* Author input */}
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder={t("memoryWall.authorPlaceholder")}
            className="min-w-0 flex-1 rounded border border-white/10 bg-black/50 px-2 py-1.5 font-mono text-[11px] text-white/80 placeholder-white/30 outline-none focus:border-amber-400/40"
          />

          {/* Color picker */}
          <div className="flex gap-1.5">
            {STICKY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`h-5 w-5 rounded-full border-2 transition-transform ${
                  selectedColor === color
                    ? "scale-110 border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newContent.trim()}
            className="rounded border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200 transition-colors hover:border-amber-400/50 hover:bg-amber-500/25 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("memoryWall.addMemory")}
          </button>
        </div>
      </div>

      {/* ---- Cards Grid ---- */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {memories.length === 0 ? (
          <div className="px-2 py-6 text-center font-mono text-[11px] text-white/35">
            {t("memoryWall.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {memories.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg px-4 py-3 shadow-md transition-shadow hover:shadow-lg"
                style={{ backgroundColor: item.color }}
              >
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-black/50 opacity-0 transition-opacity hover:bg-black/30 hover:text-black/80 group-hover:opacity-100"
                  aria-label={t("memoryWall.delete")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>

                {/* Content */}
                <p className="whitespace-pre-wrap font-mono text-[12px] leading-5 text-black/80">
                  {item.content}
                </p>

                {/* Footer: author + time */}
                <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-black/50">
                  <span>
                    {t("memoryWall.author")}: {item.author}
                  </span>
                  <span>{formatRelativeTime(item.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
