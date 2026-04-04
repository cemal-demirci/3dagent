"use client";

/**
 * CompleteStep — Final wizard screen before entering the office.
 */
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Building2, Rocket } from "lucide-react";
import { t, tReplace } from "@/lib/i18n";

export const CompleteStep = ({
  companyCreated = false,
  companyName = null,
}: {
  companyCreated?: boolean;
  companyName?: string | null;
}) => {
  const hasFiredConfettiRef = useRef(false);

  useEffect(() => {
    if (!companyCreated || hasFiredConfettiRef.current) return;
    hasFiredConfettiRef.current = true;
    const defaults = {
      spread: 68,
      startVelocity: 32,
      ticks: 220,
      gravity: 1.05,
      zIndex: 100130,
      colors: ["#67e8f9", "#fbbf24", "#fde047", "#f472b6", "#c4b5fd"],
    };
    void confetti({
      ...defaults,
      particleCount: 90,
      origin: { x: 0.5, y: 0.35 },
    });
    window.setTimeout(() => {
      void confetti({
        ...defaults,
        particleCount: 70,
        angle: 60,
        origin: { x: 0.15, y: 0.45 },
      });
      void confetti({
        ...defaults,
        particleCount: 70,
        angle: 120,
        origin: { x: 0.85, y: 0.45 },
      });
    }, 180);
  }, [companyCreated]);

  const displayName = companyName?.trim() || "";

  return (
    <div className="relative flex flex-col items-center justify-center gap-5 py-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/15">
        <Rocket className="h-7 w-7 text-amber-300" />
      </div>

      <div className="space-y-2 text-center">
        <p className="text-base font-semibold text-white">
          {companyCreated
            ? displayName
              ? tReplace("onboarding.complete.companyCreated", { name: displayName })
              : t("onboarding.complete.companyCreatedFallback")
            : t("onboarding.complete.welcomeTitle")}
        </p>
        <p className="max-w-sm text-sm text-white/60">
          {companyCreated
            ? displayName
              ? tReplace("onboarding.complete.companyReadyDesc", { name: displayName })
              : t("onboarding.complete.companyReadyFallbackDesc")
            : t("onboarding.complete.welcomeDesc")}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
          <Building2 className="h-4 w-4 shrink-0 text-amber-300" />
          <div>
            <p className="text-xs font-medium text-white">
              {companyCreated ? t("onboarding.complete.meetTeam") : t("onboarding.complete.exploreOffice")}
            </p>
            <p className="text-[10px] text-white/45">
              {companyCreated
                ? t("onboarding.complete.meetTeamHint")
                : t("onboarding.complete.exploreOfficeHint")}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-white/35">
        {t("onboarding.complete.rerunHint")}
      </p>
      <p className="text-[10px] text-white/25 mt-4">
        {t("branding.poweredBy")}
      </p>
    </div>
  );
};
