/**
 * WelcomeStep — First onboarding screen introducing Claw3D.
 */
import { Building2, Eye, MessageSquare, Users } from "lucide-react";
import { t } from "@/lib/i18n";

const features = [
  {
    icon: Eye,
    titleKey: "onboarding.welcome.feature.watch.title" as const,
    descKey: "onboarding.welcome.feature.watch.desc" as const,
  },
  {
    icon: Users,
    titleKey: "onboarding.welcome.feature.manage.title" as const,
    descKey: "onboarding.welcome.feature.manage.desc" as const,
  },
  {
    icon: MessageSquare,
    titleKey: "onboarding.welcome.feature.chat.title" as const,
    descKey: "onboarding.welcome.feature.chat.desc" as const,
  },
  {
    icon: Building2,
    titleKey: "onboarding.welcome.feature.build.title" as const,
    descKey: "onboarding.welcome.feature.build.desc" as const,
  },
] as const;

export const WelcomeStep = () => (
  <div className="space-y-5">
    <div className="text-center mb-4">
      <h1 className="text-2xl font-display text-amber-400">CLAW3D</h1>
      <p className="text-[11px] text-white/40">{t("branding.developedBy")}</p>
    </div>
    <div className="space-y-2">
      <p className="text-sm leading-relaxed text-white/80">
        {t("onboarding.welcome.intro").split("{highlight}")[0]}
        <span className="font-medium text-white">{t("onboarding.welcome.highlight")}</span>
        {t("onboarding.welcome.intro").split("{highlight}")[1]}
      </p>
      <p className="text-sm text-white/60">
        {t("onboarding.welcome.wizardHint")}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {features.map(({ icon: Icon, titleKey, descKey }) => (
        <div
          key={titleKey}
          className="rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-3"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-amber-300" />
            <span className="text-xs font-semibold text-white">{t(titleKey)}</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-white/55">
            {t(descKey)}
          </p>
        </div>
      ))}
    </div>
  </div>
);
