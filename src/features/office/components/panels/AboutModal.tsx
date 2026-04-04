"use client";

/**
 * AboutModal — Minimal about dialog for Claw3D.
 */

import { X } from "lucide-react";
import { t, tReplace } from "@/lib/i18n";

const TECHNOLOGIES = ["Next.js", "Three.js", "Tailwind CSS", "Claude Agent SDK"];

export function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-xl border border-white/10 bg-[#0d0d0d] px-6 py-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-white/40 transition-colors hover:text-white"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl text-amber-400">CLAW3D</h2>
          <p className="text-xs text-white/50">
            {tReplace("about.version", { version: "0.1.4" })}
          </p>

          <div className="space-y-1">
            <p className="text-sm text-white/80">
              {t("branding.author")}
            </p>
            <a
              href="https://cemal.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400/70 transition-colors hover:text-amber-300"
            >
              cemal.cloud
            </a>
          </div>

          <div className="w-full border-t border-white/8 pt-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/40">
              {t("about.technologies")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {TECHNOLOGIES.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-white/30">{t("about.license")}</p>
        </div>
      </div>
    </div>
  );
}
