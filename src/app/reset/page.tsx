"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResetPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Clear all 3dagent cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch {}
    const id = requestAnimationFrame(() => setDone(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!done) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="rounded-xl border border-amber-700/40 bg-[#1a1008] px-8 py-6 text-center shadow-2xl">
        <p className="font-mono text-lg font-bold text-amber-400">Sıfırlama Tamamlandı</p>
        <p className="mt-2 text-sm text-amber-100/70">
          Tüm veriler temizlendi. Şimdi kuruluma başlayabilirsin.
        </p>
        <Link
          href="/office/"
          className="mt-4 inline-block rounded-lg bg-amber-500 px-6 py-2 font-mono text-sm font-semibold text-black hover:bg-amber-400"
        >
          Office&apos;e Git →
        </Link>
      </div>
    </div>
  );
}
