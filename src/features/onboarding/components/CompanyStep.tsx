import { Building2, Sparkles, Users, Wand2 } from "lucide-react";
import { t } from "@/lib/i18n";

export type CompanyStepProps = {
  connected: boolean;
  agentCount: number;
  onOpenCompanyBuilder: () => void;
};

export const CompanyStep = ({
  connected,
  agentCount,
  onOpenCompanyBuilder,
}: CompanyStepProps) => {
  const canOpenBuilder = connected && agentCount > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
            <Building2 className="h-5 w-5 text-amber-300" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">{t("onboarding.company.title")}</p>
            <p className="text-xs leading-5 text-white/60">
              {t("onboarding.company.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          {
            icon: Sparkles,
            titleKey: "onboarding.company.improveBrief" as const,
            descKey: "onboarding.company.improveBriefDesc" as const,
          },
          {
            icon: Users,
            titleKey: "onboarding.company.generateTeam" as const,
            descKey: "onboarding.company.generateTeamDesc" as const,
          },
          {
            icon: Wand2,
            titleKey: "onboarding.company.createEverything" as const,
            descKey: "onboarding.company.createEverythingDesc" as const,
          },
        ].map(({ icon: Icon, titleKey, descKey }) => (
          <div
            key={titleKey}
            className="rounded-md border border-white/8 bg-white/[0.02] px-3 py-3"
          >
            <Icon className="h-4 w-4 text-white/70" />
            <p className="mt-2 text-[11px] font-semibold text-white">{t(titleKey)}</p>
            <p className="mt-1 text-[10px] leading-4 text-white/45">{t(descKey)}</p>
          </div>
        ))}
      </div>

      <div className="pt-4">
        {canOpenBuilder ? (
          <div className="flex justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-[#1a1206] transition-colors hover:bg-amber-400"
              onClick={onOpenCompanyBuilder}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("onboarding.company.openBuilder")}
            </button>
          </div>
        ) : (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-100/80">
            {t("onboarding.company.builderHint")}
          </div>
        )}
      </div>
    </div>
  );
};
