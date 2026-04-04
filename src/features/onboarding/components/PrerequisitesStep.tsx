/**
 * PrerequisitesStep — Tells users what they need before connecting.
 */
import { CheckCircle2, ExternalLink } from "lucide-react";
import { t } from "@/lib/i18n";

const prerequisites = [
  {
    label: t("onboarding.prereq.installed.label"),
    detail: t("onboarding.prereq.installed.detail"),
    link: "https://docs.openclaw.ai",
    linkLabel: t("onboarding.prereq.installed.link"),
  },
  {
    label: t("onboarding.prereq.running.label"),
    detail: t("onboarding.prereq.running.detail"),
    command: "openclaw gateway start",
  },
  {
    label: t("onboarding.prereq.urlToken.label"),
    detail: t("onboarding.prereq.urlToken.detail"),
  },
  {
    label: t("onboarding.prereq.nodejs.label"),
    detail: t("onboarding.prereq.nodejs.detail"),
    link: "https://nodejs.org",
    linkLabel: t("onboarding.prereq.nodejs.link"),
  },
] as const;

export const PrerequisitesStep = () => (
  <div className="space-y-2.5">
    <p className="text-[13px] leading-5 text-white/70">
      {t("onboarding.prereq.intro")}
    </p>

    <div className="space-y-1.5">
      {prerequisites.map(({ label, detail, ...rest }) => (
        <div
          key={label}
          className="flex gap-2.5 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2"
        >
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-white">{label}</p>
            <p className="mt-0.5 text-[10px] leading-4 text-white/55">{detail}</p>
            {"command" in rest ? (
              <code className="mt-1 block rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                {rest.command}
              </code>
            ) : null}
            {"link" in rest && rest.link ? (
              <a
                href={rest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[10px] leading-4 text-amber-300 hover:text-amber-200"
              >
                {rest.linkLabel ?? t("onboarding.prereq.learnMore")}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>

    <p className="text-[10px] leading-4 text-white/40">
      {t("onboarding.prereq.helpHint")}{" "}
      <a
        href="https://docs.openclaw.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-300/70 hover:text-amber-200"
      >
        docs.openclaw.ai
      </a>{" "}
      <a
        href="https://discord.com/invite/clawd"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-300/70 hover:text-amber-200"
      >
        {t("onboarding.prereq.joinDiscord")}
      </a>
    </p>
  </div>
);
