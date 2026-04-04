"use client";

import { useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export function PWAUpdateBanner() {
  const { updateAvailable, applyUpdate } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 px-5 py-3 bg-[#1a1206] border border-amber-400/40 rounded-xl shadow-lg shadow-amber-900/20">
      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
      <span className="text-sm text-neutral-200 whitespace-nowrap">
        Yeni sürüm mevcut
      </span>
      <button
        onClick={applyUpdate}
        className="px-3 py-1 bg-amber-400 text-black text-sm font-semibold rounded-md hover:bg-amber-300 transition-colors"
      >
        Güncelle
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-neutral-500 hover:text-neutral-300 transition-colors"
        aria-label="Kapat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
