/**
 * AgentsStep — Shows discovered agents after gateway connection.
 */
import { Bot, Users, WifiOff } from "lucide-react";
import { t, tReplace } from "@/lib/i18n";

export type AgentsStepProps = {
  agentCount: number;
  connected: boolean;
};

export const AgentsStep = ({ agentCount, connected }: AgentsStepProps) => {
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <WifiOff className="h-8 w-8 text-white/30" />
        <p className="text-sm text-white/60">
          {t("onboarding.agents.connectFirst")}
        </p>
      </div>
    );
  }

  if (agentCount === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <Bot className="h-6 w-6 text-white/40" />
          </div>
          <p className="text-sm font-medium text-white">{t("onboarding.agents.noAgents")}</p>
          <p className="max-w-xs text-center text-xs text-white/55">
            {t("onboarding.agents.noAgentsHint")}
          </p>
        </div>

        <div className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
          <p className="text-xs font-medium text-white/80">{t("onboarding.agents.quickStart")}</p>
          <ol className="mt-2 space-y-1.5 text-[11px] text-white/55">
            <li>{t("onboarding.agents.quickStep1")}</li>
            <li>{t("onboarding.agents.quickStep2")}</li>
            <li>{t("onboarding.agents.quickStep3")}</li>
            <li>{t("onboarding.agents.quickStep4")}</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
        <Users className="h-5 w-5 text-amber-300" />
        <div>
          <p className="text-sm font-semibold text-white">
            {tReplace("onboarding.agents.discovered", { count: agentCount })}
          </p>
          <p className="text-[11px] text-white/55">
            {t("onboarding.agents.teamReady")}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-white/70">
          {t("onboarding.agents.whatYouCanDo")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: t("onboarding.agents.chat"), desc: t("onboarding.agents.chatDesc") },
            { label: t("onboarding.agents.approve"), desc: t("onboarding.agents.approveDesc") },
            { label: t("onboarding.agents.configure"), desc: t("onboarding.agents.configureDesc") },
            { label: t("onboarding.agents.monitor"), desc: t("onboarding.agents.monitorDesc") },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2"
            >
              <p className="text-[11px] font-semibold text-white">{label}</p>
              <p className="text-[10px] text-white/45">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
