"use client";

/**
 * AccessGateScreen — Visual login form shown when STUDIO_ACCESS_TOKEN is set.
 *
 * The server-side access-gate middleware (server/access-gate.js) checks for a
 * `studio_access` cookie. Without this screen, users get a plain-text 401.
 * This component provides a branded form that sets the cookie and reloads.
 */

import { useState } from "react";
import { t } from "@/lib/i18n";

export function AccessGateScreen() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError(false);

    // Set the studio_access cookie and try to fetch
    document.cookie = `studio_access=${encodeURIComponent(token.trim())}; path=/; SameSite=Lax`;

    try {
      const res = await fetch("/api/gateway/ws", { method: "HEAD" });
      if (res.status === 401) {
        // Token is wrong — clear cookie
        document.cookie = "studio_access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setError(true);
        setLoading(false);
        return;
      }
    } catch {
      // Network error or upgrade-only endpoint — cookie is set, just reload
    }

    // Reload to let the server validate
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-xs space-y-6 text-center">
        <div>
          <h1 className="font-display text-4xl text-amber-400">3DAGENT</h1>
          <p className="mt-1 text-[11px] text-white/40">
            {t("branding.developedBy")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError(false);
            }}
            placeholder={t("access.tokenPlaceholder")}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-amber-400/50"
            autoFocus
            spellCheck={false}
          />

          {error && (
            <p className="text-xs text-red-400">{t("access.error")}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="h-10 w-full rounded-lg bg-amber-500 text-sm font-semibold text-[#1a1206] transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "..." : t("access.submit")}
          </button>
        </form>

        <p className="text-[10px] text-white/25">
          {t("branding.poweredBy")}
        </p>
      </div>
    </div>
  );
}
